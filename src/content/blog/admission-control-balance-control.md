---
title: LLM Gateway Admission Control (2) — Budget Control
date: "2026-09-05"
summary: 정산된 Account Balance와 미정산 rough debit으로 Redis에 Account Balance Cache를 만들고, 정산 주기 사이의 추가 사용을 최소화합니다.
---

> **LLM Gateway Admission Control**

1. [Rate Limits](/blog/admission-control-rate-limit/)
2. [Budget Control](/blog/admission-control-balance-control/) — current
3. Spend Limits — coming soon

## TL;DR

![Preflight에서 Account Balance Cache를 확인하고 성공한 inference를 rough debit한 뒤, 별도 worker가 Ledger를 정산하고 Account Balance Cache를 갱신하는 흐름](/images/blog/admission-control-budget-control-flow.svg)

### 정책

- **잔액 귀속** — 각 Team은 하나의 USD Account를 가지며, 서로 다른 API Key도 같은 Account Balance를 공유합니다.
- **허용 기준** — Redis의 Account Balance Cache가 0 이상인 경우에만 request를 허용합니다.
- **반영 시점** — 성공한 inference는 즉시 rough debit하고, 별도 worker가 Usage Charge와 Account Balance를 확정합니다.

### 흐름

Redis Account Balance Cache로 Team의 추가 사용을 빠르게 막고, Worker가 DB에서 정확한 잔액을 확정합니다.

- **Preflight** — Cache가 0 이상일 때만 inference를 시작합니다.
- **Postflight** — 성공한 inference는 rough debit으로 Cache에 바로 반영합니다.
- **Settlement** — Worker가 Usage Charge·Ledger·Account Balance를 DB transaction으로 확정하고 Cache를 갱신합니다.

## 1. Budget Control은 잔액과 Cache를 분리합니다

Budget Control은 지금 inference를 계속 허용할지 판단합니다.  
Rate Limits가 Team Tier의 RPM·TPM을 제어했다면, Budget Control은 Team이 잔액을 넘어 추가로 사용하는 것을 막습니다.

| 데이터 | 역할 | 핵심 제약 |
| --- | --- | --- |
| Account Balance | 마지막 정산까지 확정된 Team의 USD 잔액 | Team당 하나이며 credit·debit이 같은 row lock을 공유 |
| Account Balance Cache | inference path가 읽는 Redis 잔액 | 정산된 잔액에 rough debit을 반영한 값 |
| Inference Record | Gateway가 관찰한 Provider 실행 1건의 모델·usage·metadata | 자체 row ID와 `(inference_id, attempt_no)` unique |
| Usage Charge | usage와 가격표로 만든 정확한 사용료 | `inference_record_id` FK는 unique |
| Account Ledger Entry | Account credit·debit의 append-only 이력 | Account가 mutation의 부수 효과로 생성 |

Account Balance는 마지막 정산까지 확정된 원장 값이고, Account Balance Cache는 inference path의 빠른 판단값입니다.  
Cache는 정산된 잔액에 rough debit을 바로 반영하므로, 두 값을 같은 것으로 취급하지 않습니다.

## 2. Inference path는 Cache만 읽습니다

### Preflight에서 inference를 허용합니다

Preflight는 Account Balance Cache가 0 이상일 때만 Provider 호출을 허용하고, 음수이면 `402`로 끝냅니다.  
호출 전에 금액을 reservation하거나 Account Balance를 바꾸지는 않습니다.

inference마다 DB를 읽으면 같은 Team의 Account row가 hot path가 됩니다.  
DB에서 동기 정산까지 하면 가격 계산과 Ledger transaction도 inference 처리량을 제한합니다. 정확한 정산은 다음 Worker path에서 수행합니다.

### Provider dispatch의 identity를 정합니다

`inference_id`는 Client가 시작한 logical inference의 ID로, 첫 Provider dispatch 전에 발급합니다.  
Gateway retry·fallback은 같은 `inference_id`를 유지하고, Provider dispatch마다 `attempt_no`를 하나씩 올립니다.

같은 payload를 다시 보냈다는 사실만으로 같은 inference가 되지는 않습니다.  
명시적인 idempotency key가 있을 때만 Client 재시도를 기존 `inference_id`에 연결합니다.

### Postflight에서 rough debit합니다

Provider가 성공하면 Gateway는 Account Balance Cache를 rough debit한 뒤 Inference Record를 Kafka stream으로 전달합니다.  
Kafka는 정산을 끝내는 곳이 아니라, Worker가 이후 정산할 inference 사실을 안전하게 넘기는 경계입니다.

- **Record 전달 재시도** — Inference Record만 멱등하게 재발행합니다. Kafka 재전달이나 Worker 재시도가 rough debit을 다시 실행하지는 않습니다.
- **Redis 결과 불명확** — 같은 debit을 독립적으로 재시도하지 않습니다. 다음 정산이 Cache를 정산된 Account Balance로 갱신합니다.

## 3. Worker가 정산을 확정합니다

Kafka consumer는 자체 row ID를 가진 `PENDING` Inference Record를 저장하고, `(inference_id, attempt_no)` unique로 재전달을 막습니다.  
Usage Charge는 `inference_record_id` unique로 한 실행에 한 번만 만들며, logical inference 하나에는 여러 Charge가 생길 수 있습니다.

### Worker는 Usage Charge를 Account별로 묶습니다

Scheduler가 `PENDING` Record를 batch로 가져오면, Worker는 실행 Record마다 Usage Charge를 계산하고 같은 Account의 Charge를 묶습니다.

1. 각 Record의 usage와 가격표로 Usage Charge를 만듭니다.
2. 같은 Account의 Charge 합계로 `debit(USAGE, amount)`을 요청합니다.
3. Account는 Balance를 차감하고 `DEBIT · USAGE` Ledger Entry를 자동으로 남깁니다.
4. 포함된 Inference Record를 `SETTLED`로 전이합니다.

Worker는 Ledger Entry를 직접 만들지 않습니다. Account debit이 Balance와 Ledger를 같은 DB transaction에서 확정합니다. 금액은 scale을 강제하지 않은 USD `numeric`으로 저장하며, Ledger는 수정하지 않습니다.

### 정산 뒤 Cache를 갱신합니다

DB commit 뒤 Worker는 정산된 Account Balance 값으로 Account Balance Cache를 갱신합니다. rough debit을 다시 합산하거나 정산 금액과의 차이만 보정하지 않습니다.

DB와 Redis는 하나의 transaction이 아닙니다. Redis 갱신 실패로 DB 정산을 되돌리지 않으며, 다음 정산이나 정상 Cache miss가 Account Balance를 기준으로 Cache를 다시 만듭니다.  
즉, Cache는 원장과 같은 정확도를 보장하는 값이 아니라 admission을 위한 빠른 판단값입니다.

## 4. Cache 장애와 음수 잔액을 함께 관리합니다

### Cache 수명과 key miss를 관리합니다

```text
quota:{teamId}:account-balance
```

Cache는 정수 scaled USD로 저장합니다. rough debit에는 올림을 적용하고, postflight rough debit과 Worker의 Cache 갱신은 TTL을 연장합니다.

- **TTL** — 1시간에 0~3분 jitter를 더합니다. preflight read는 TTL을 연장하지 않습니다.
- **정상 key miss** — Redis가 응답하면 DB의 Account Balance를 읽어 `SET NX`로 Cache를 채운 뒤 판단합니다. Cache는 정산 기준값으로 다시 시작하고, 아직 정산되지 않은 사용량은 다음 Worker 정산에서 확정됩니다.
- **DB 보호** — Gateway DB connection pool이 동시에 허용할 Cache fill 조회 수를 제한합니다.

### Redis 장애는 신규 사용을 열지 않습니다

Rate Limits와 달리, Budget Control은 Cache 상태를 모르는 request를 통과시키지 않습니다.  
Redis Cluster mode를 전제로 하므로, Redis가 응답하지 않으면 fail-open하지 않고 `503`으로 끝냅니다.

| 장애 패턴 | 처리 |
| --- | --- |
| Cache avalanche | 긴 TTL과 jitter로 동시 만료를 분산합니다. |
| Cache stampede | 정상 key miss는 DB look-aside로 채우되, Gateway DB connection pool로 동시에 실행할 Cache fill을 제한합니다. |
| Cache penetration | API Key auth가 먼저 실행되므로 유효하지 않은 Team은 Account Balance 조회까지 도달하지 않습니다. |
| Redis key 데이터 유실 | Redis가 응답하면 정상 key miss와 같이 DB look-aside로 Cache를 채웁니다. |
| Redis timeout·failover | 상태가 불명확하면 `503`을 반환합니다. Redis 없이 request를 허용하지 않습니다. |

### 음수 Account Balance는 허용하되, gap은 줄입니다

LLM inference의 실제 Usage Charge는 응답 뒤에 확정됩니다. 호출 전에 최대 금액을 reservation하고 Team별 mutation을 직렬화하면 음수 Account Balance를 막을 수 있지만, 모든 inference가 공유 잔액을 선점해 throughput과 복구 복잡도를 희생합니다. 이 설계는 rough debit으로 정산 gap을 줄이고, Cache가 음수가 된 뒤부터 새 request를 거절합니다.

```text
negative balance gap
≈ in-flight request 수 × 최대 Usage Charge
  + postflight 지연 동안의 Usage Charge
  + 추정값과 Usage Charge의 차이
```

음수 잔액의 규모는 Rate Limits, Team별 concurrency, 허용 모델, `max_output_tokens`로 줄일 수 있습니다. 이 값은 엄밀한 상한이 아니라 함께 관측할 지표를 보여주는 근사식입니다.

```http
HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "error": {
    "type": "insufficient_quota",
    "code": "credit_balance_exhausted",
    "message": "Team balance is negative. Add credits and retry."
  }
}
```

## 참고

- [LLM Gateway Admission Control (1) — Rate Limits](/blog/admission-control-rate-limit/) — Team 범위와 선행 admission policy.
- [OpenAI Prepaid Billing](https://help.openai.com/en/articles/8264644-what-is-prepaid-billing) — Usage Charge 반영 지연과 음수 Account Balance.
- [Stripe Billing Credits](https://docs.stripe.com/billing/subscriptions/usage-based/billing-credits) — Credit Balance와 append-only Ledger.
