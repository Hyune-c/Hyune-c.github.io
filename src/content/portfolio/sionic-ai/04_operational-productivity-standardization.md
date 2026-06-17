---
title: 운영 지원 도구 개발 및 업무 표준화
company: 사이오닉AI
companySlug: sionic-ai
period: 2024.09 — now
order: 4
summary: OpenAPI 기반 자체 API Hub로 문서·테스트 흐름 표준화. 회귀 테스트와 WARN 로그 AI 리포트로 모니터링 강화. onepage-payment·storm-differ·BO 등 운영 지원 도구 개발.
tags: [OpenAPI, Apidog, BO, Python, Node.js]
---

## 배경

AI 활용으로 제품 개발 속도는 빨라졌지만, 반대로 서비스 간 책임 소재가 명확하지 않은 회색 영역의 업무는 누락되기 쉬워졌습니다.

- API 문서, 테스트 시나리오, 테스트 방법론, 에러 응답 형식이 서비스마다 제각각 다르게 관리되었습니다
- 외부 SaaS 도구에 의존하던 문서·테스트를, airgap 환경에서도 쓰도록 코드와 함께 배포되는 자체 도구로 옮겨야 했습니다
- 필요하지만 정식 제품의 기능이 아니거나 책임 소재가 모호한 회색 영역의 업무가 많았습니다

## 성과

- OpenAPI 기반 자체 API Hub와 회귀 테스트 자동화로, airgap 환경에서도 동작하는 문서·테스트 흐름을 정착시켰습니다
- 결제 링크 생성, PG 가맹점/정산 관리, 파싱 결과 비교, 백오피스성 확인 업무 등을 위한 도구를 개발해 운영 편의성을 높였습니다
- WARN 로그를 매일 AI 로 집계·분류해 잠재 장애를 선제 감지하는 체계를 만들어, ERROR 알림만으로는 놓치던 사각지대를 메웠습니다
- NewRelic, 구조적 로깅, 표준 Error DTO, Skill 작성 기준을 정리하고 전파해 팀이 같은 기준으로 개발/테스트/운영할 수 있는 기반을 만들었습니다

## 상세

### API Hub — 문서·스펙 표준화

외부 SaaS(Apidog)로 관리하던 문서·테스트를, airgap 환경을 지원하기 위해 OpenAPI 기반 자체 Hub 로 옮겼습니다.

<div class="img-grid-2">

![Apidog 기반 초기 API Hub](./assets/operational-productivity-standardization-image-03.png)

![OpenAPI 기반 자체 API Hub](./assets/operational-productivity-standardization-image-04.png)

</div>

### 모니터링 강화

테스트와 로그를 자동화·집계해, 문제를 사후가 아니라 사전에 감지하도록 했습니다.

- **회귀 테스트**: 외부 도구에 의존하던 수동 시나리오를 Python 스크립트와 스케줄러로 대체하고, 정기 실행과 배포 후 실행을 통해 기존 동작이 깨지지 않는지 확인해 서비스의 신뢰성을 높였습니다
- **WARN 로그 AI 리포트**: 묻히기 쉬운 WARN 로그를 데일리로 AI 가 유형별로 묶어 원인·액션·trace 까지 정리한 리포트를 Slack 으로 발송하고, 이를 triage 해 장애가 되기 전에 선제 대응

![시나리오 러너 스케줄 실행 및 Slack 알림](./assets/operational-productivity-standardization-image-05.png)

<div class="img-grid-2">

![WARN 데일리 리포트 — AI 유형별 집계 (원인·액션·원본·trace)](./assets/operational-productivity-warn-summary.png)

![리포트 기반 triage — 담당자·난이도 배정](./assets/operational-productivity-warn-triage.png)

</div>

### 운영 지원 도구 개발

- **onepage-payment**: 결제 링크 생성과 고객 전달을 운영자가 직접 처리할 수 있도록 지원
- **storm-differ**: Storm Parse 결과를 파서·모델 기준으로 비교해 품질 변화를 확인할 수 있도록 지원
- **BO**: 기록이 없거나 책임이 모호한 서비스의 반복 운영 요청을 화면·데이터 흐름으로 처리할 수 있도록 지원

<div class="img-grid-asym">

![결제 링크 생성](./assets/operational-productivity-standardization-image-01.png)

![Storm APIs Parse Differ](./assets/operational-productivity-standardization-image-02.png)

</div>

### 운영 표준화 기여

- 외부 서비스 (Anthropic, OpenAI, Vertex AI, GitHub) API Key·권한과 서비스별 접근 범위 정리
- NewRelic, logback, structured logging 기준 정리
- 표준 Error DTO 와 유지보수 가능한 Skill 작성 방식 문서화
- [common-config](https://github.com/Hyune-s-lab/my-spring-cloud-config) Git / Vault 저장소를 백엔드로 두고 Spring Cloud Config 표준 API 로 설정을 조회, airgap 환경에서도 feature toggle·공통 설정을 관리할 수 있도록 구성
