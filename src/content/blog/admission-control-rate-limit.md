---
title: LLM Gateway Admission Control (1) — Rate Limits
date: "2026-09-03"
summary: LLM Gateway가 API Key로 Team을 식별하고, Team Tier와 Redis GCRA로 RPM·TPM을 제어하는 Rate Limits 설계를 정리합니다.
---

## TL;DR

![Preflight에서 RPM·TPM을 판정하고 RPM TAT를 전진시킨 뒤, inference 성공 응답의 usage로 postflight에서 TPM TAT를 전진시키는 경로](/images/blog/admission-control-rate-limit-flow.svg)

### 정책

- **인증 수단** — API Key는 호출자를 인증하고 Team과 Tier를 찾습니다.
- **Tier 정책** — Rate Limits는 RPM (requests per minute)·TPM (tokens per minute)을 정의하는 Tier로 관리하며, 모든 Team은 하나의 Tier를 가집니다.

### 요약

Redis 기반 GCRA로 Team의 RPM·TPM을 제어하되, 모든 초과를 엄밀히 막기 위한 오버 엔지니어링은 지양합니다.  
Preflight에서 RPM·TPM을 함께 판정하고, RPM TAT는 허용 즉시, TPM TAT는 성공 응답의 실제 `usage`로 postflight에서 전진시킵니다.

## API Key를 늘려도 허용량은 늘어나지 않습니다

Rate Limits는 Team에 귀속됩니다. API Key를 늘려도 같은 Team의 허용량을 공유하므로 전체 허용량은 늘어나지 않습니다.

```text
Team A
├─ API Key (server) ─┐
├─ API Key (agent)  ─┼─ Team의 RPM·TPM 공유
└─ API Key (CI)     ─┘
```

### Tier는 RPM·TPM을 정의합니다

| 제한 | `tier_1` | `tier_2` | `tier_3` | `tier_4` | `tier_5` |
| --- | ---: | ---: | ---: | ---: | ---: |
| RPM | 20 | 60 | 300 | 1,000 | 3,000 |
| TPM | 100,000 | 500,000 | 2,000,000 | 10,000,000 | 40,000,000 |

- `tier_1`은 RPM과 TPM을 함께 소진할 때 request당 평균 5,000 tokens에 해당합니다.
- Tier policy는 애플리케이션 부트 타임에 로컬 캐시에 적재됩니다.

### Provider들의 설계를 참고하되, 필요한 범위만 적용합니다

| 항목 | LLM Gateway baseline | OpenAI | Claude |
| --- | --- | --- | --- |
| RPM | Team Tier 기준 | model·shared limit 기준 | model class 기준 |
| TPM | Team Tier의 input·output 합산 | model·shared limit 기준 | input·output 분리 |
| scope | Team | organization·project | organization·workspace |
| 응답 헤더 | limit·remaining·reset | limit·remaining·reset | limit·remaining·reset |

### 지금 Burst를 넣는 것은 오버 엔지니어링입니다

- **Provider routing** — 여러 Provider를 동등한 호출 대상으로 두고 request를 분산합니다.
- **캐시 효율** — Provider를 바꾸면 이전 Provider의 prompt cache를 재사용하지 못해 비용과 응답 지연이 늘 수 있습니다.
- **동적 허용량** — 각 Provider의 limit·remaining·reset을 관측해, 해당 Provider에 보낼 request의 허용량을 동적으로 조절합니다.

Burst를 넣으려면 Provider별 수용 가능한 quota를 고려해야 하지만, routing·quota 관측·캐시 효율·장애 정책 등 검토할 요소가 많습니다.

## Rate Limits 알고리즘으로 GCRA를 선택했습니다

| 방식 | 판단 | 시간 복잡도 | 공간 복잡도 | Redis state | 한계 |
| --- | --- | --- | --- | --- | --- |
| Fixed Window | 제외 | O(1) | O(1) | minute window counter | 분 경계 전후로 request가 몰릴 수 있음 |
| Sliding Window Log | 제외 | O(log n + m) | O(n) | window 안의 request timestamp | request 수만큼 state와 정리 비용이 증가함 |
| Token Bucket | 대안 | O(1) | O(1) | 잔량·마지막 refill 시각 | 잔량과 refill 기준을 함께 관리 |
| GCRA | 선택 | O(1) | O(1) | 항목별 TAT 하나 | 남은 허용량과 reset을 TAT에서 역산해야 함 |

- **선택 이유** — Token Bucket의 lazy-refill 표현보다 state가 단순하고, 두 제한 항목에 같은 판정 모델을 적용하기 쉽습니다.
- **TAT (theoretical arrival time)** — Redis `TIME`의 epoch microseconds로 표현한 debt 해소 기준 시각이며, RPM과 TPM은 각각 독립된 TAT를 가집니다.

### Redis에는 TAT와 Tier 매핑을 둡니다

TAT key는 `quota → Team → 정책 → 상태` 순서로 읽습니다. `{teamId}`는 두 TAT key를 같은 Redis Cluster slot에 배치하는 hash tag입니다.

- 60 RPM이면 request 허용 시 RPM TAT가 1초 전진합니다.
- 100,000 TPM에서 2,000 tokens를 사용하면 TPM TAT가 1.2초 전진합니다.

```text
quota:{teamId}:rate:request_tat  # RPM · 1788436801000000 → 2026-09-03T12:00:01Z
quota:{teamId}:rate:token_tat    # TPM
quota:{teamId}:tier             # tier_1 · TTL 적용
```

- Team의 Tier ID는 Redis에서, 해당 Tier의 정책은 부트 타임에 적재한 로컬 캐시에서 읽습니다.
- Tier ID는 TTL 기반 look-aside로 관리합니다. 캐시가 없으면 DB에서 채우고, Tier 변경도 TTL 만료 후 반영합니다. 기존 TAT는 초기화하지 않습니다.
- 진행 중인 호출은 preflight에서 읽은 Tier 정책을 postflight까지 사용합니다.

### RPM과 TPM은 다른 시점에 반영합니다

**TPM 사용량은 postflight에 반영합니다.**

- 실제 `usage`가 응답에 오기 때문입니다.
- 사전에 산정하려면 tokenizer로 input을 계산하고 output은 별도로 추정해야 하므로, 이 설계에서는 오버 엔지니어링으로 봅니다.

**RPM 사용량은 preflight에 반영합니다.**

- 호출 전에 이미 1건임을 알 수 있습니다.
- 채팅처럼 추론 시간이 긴 호출에서 postflight까지 기다리면, 진행 중인 호출이 RPM에 잡히지 않아 추가 request가 계속 통과할 수 있습니다.

Preflight는 두 TAT가 모두 현재 시각 이하일 때만 RPM TAT를 전진시키고, postflight는 adapter가 정규화한 전체 input(캐시 포함)·output 사용량으로 TPM TAT를 전진시킵니다.  
각 단계는 하나의 Lua로 원자적으로 처리하며, 응답 헤더에 사용할 두 TAT를 반환합니다.

- **동시 inference** — 이미 시작한 request의 초과 사용은 미리 막지 못합니다. 응답을 회수하지 않고, 다음 request를 더 오래 막는 debt로 반영합니다.
- **Final usage 누락** — streaming 중단 등으로 최종 usage를 받지 못하면 TPM TAT에 반영하지 않습니다. 별도 추정은 하지 않으며, adapter별 누락률을 관측합니다.
- **Provider 실패** — TPM TAT는 전진시키지 않지만, 이미 전진한 RPM TAT도 되돌리지 않습니다. 실패마다 RPM refund를 두지는 않습니다.

### 제한 결과를 정규화해 돌려줍니다

```http
HTTP/1.1 200 OK
Content-Type: application/json
x-ratelimit-limit-requests: 20
x-ratelimit-remaining-requests: 1
x-ratelimit-reset-requests: 0s
x-ratelimit-limit-tokens: 100000
x-ratelimit-remaining-tokens: 98000
x-ratelimit-reset-tokens: 1.2s

{
  ...
  "usage": {
    "prompt_tokens": 1200,
    "completion_tokens": 800,
    "total_tokens": 2000
  }
}
```

다른 호출이 없는 Team이 `tier_1`에서 5초간 추론하고 2,000 tokens를 사용한 non-streaming 응답입니다.

`remaining-requests`는 RPM 기준으로 즉시 허용할 수 있는 request 수입니다. `remaining-tokens`는 TPM에서 미회복 token 사용량을 빼고 0 이상으로 제한한 참고 잔량입니다. 재시도 시점은 `remaining`이 아니라 `reset`·`Retry-After`를 따릅니다.  
Streaming에서는 final usage보다 먼저 헤더를 보내므로 preflight 시점의 제한 정보를 사용합니다.

Non-streaming에서 final usage나 postflight 결과를 받지 못하면 추론 응답은 유지하고 Rate Limits 헤더는 생략합니다.

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 3
x-ratelimit-limit-requests: 20
x-ratelimit-remaining-requests: 0
x-ratelimit-reset-requests: 1.5s
x-ratelimit-limit-tokens: 100000
x-ratelimit-remaining-tokens: 96000
x-ratelimit-reset-tokens: 2.4s

{
  "error": {
    "type": "rate_limit_error",
    "code": "rate_limit_exceeded",
    "message": "Team rate limit exceeded."
  }
}
```

Team의 제한을 초과한 응답입니다. `Retry-After`는 두 `reset` 중 긴 값을 초 단위로 올림하며, 거절된 request는 Provider로 보내지 않습니다.

```http
HTTP/1.1 503 Service Unavailable
Content-Type: application/json
Retry-After: 1

{
  "error": {
    "type": "server_error",
    "code": "service_unavailable",
    "message": "Rate limit check is temporarily unavailable."
  }
}
```

Preflight의 Redis timeout이나 Lua 오류는 제한 초과와 구분합니다. 제한 정보를 알 수 없으므로 Rate Limits 헤더는 생략합니다.

## TAT의 TTL·부하·장애를 관리합니다

- **TTL·Eviction** — TAT key에는 TTL을 설정하지 않고, Redis는 `noeviction`으로 운영합니다.
- **Hot key** — Cluster는 Team 간 부하를 분산할 뿐, 같은 shard에 모인 한 Team의 처리량을 늘리지는 못합니다. 전체 OPS와 단일 Team OPS를 별도로 측정합니다.

최초 요청처럼 TAT key가 없는 경우와 Redis 장애는 구분합니다.

- **key 없음** — 누적 사용이 없는 것으로 판단합니다. RPM TAT는 request 허용 시, TPM TAT는 성공 postflight에서 생성합니다.
- **Redis timeout·연산 오류** — Preflight에서 제한 상태를 확인하거나 갱신할 수 없으므로 `503`을 반환합니다.
- **Postflight 갱신 실패** — 완료된 추론을 실패로 바꾸지는 않습니다. 반영 여부가 불명확하므로 자동 재시도하지 않고 오류를 기록·알립니다.

Redis는 각 shard에 replica를 두는 Cluster 구성을 전제로 하며, preflight 장애 시 fail-open은 허용하지 않습니다. 다만 failover 시 복제되지 않은 TAT 갱신은 유실될 수 있습니다.

## 다음 단계는 Budget Control입니다

Rate Limits는 **얼마나 자주 호출할 수 있는가**를 제어합니다. 하지만 호출 제어와 비용 제어는 다른 축입니다.

다음 글에서는 실제 inference usage를 기준으로 Team의 잔액을 빠르게 읽고, Redis projection과 정산을 어떻게 분리하는지 다룹니다.  
Rate Limits가 RPM·TPM을 제한한다면, Budget Control은 허용 가능한 비용 노출을 제한합니다.

## 참고

- [redis-cell](https://github.com/brandur/redis-cell) · [Rate Limiting, Cells, and GCRA](https://brandur.org/rate-limiting) — GCRA의 TAT 모델과 Redis 구현.
- [Scripting with Lua](https://redis.io/docs/latest/develop/programmability/eval-intro/) — Preflight·postflight의 원자적 갱신.
- [Redis cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/) — Replica failover와 비동기 복제의 한계.
- OpenAI [Rate limits](https://developers.openai.com/api/docs/guides/rate-limits) · Claude [Rate limits](https://platform.claude.com/docs/en/api/rate-limits) — Provider별 RPM·TPM 범위와 response header.
- [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) — 캐시 격리 범위와 비용·응답 시간 효과.
