---
title: AI 모델 서빙 서비스 개발, 운영
company: 뤼튼 테크놀로지스
companySlug: wrtn
period: 2024.01 — 2024.07
order: 1
summary: Spring AI를 확장한 JVM 기반 hamlet2 개발 및 기존 Node 기반 hamlet1 무중단 교체. RPM 750, API response time 20% 개선.
tags: [Spring AI, JVM, Kafka, Datadog, Gatling]
---

## 배경

모놀로식으로 운영되던 기존 Node 기반 `hamlet1` 은 복잡도가 높았고, 운영 가능 인원이 1명 뿐이었습니다.  
무중단 교체 조건이 필수였고, 장기적인 발전 방향에 대한 설계도 필요했습니다.

## 성과

- `hamlet1` 의 높은 복잡도·단일 운영자 문제를 해소, JVM 기반 `hamlet2` 분리로 운영 용이성 확보
- Spring AI 기반 provider / model 확장 구조 설계, 전 세계 27개 PTU 서빙 등 장기 확장 기반 마련
- 뤼튼 메인 화면 연관링크·다이내믹칩 서빙, RPM 750 / API 응답시간 20% 개선
- retry 로직과 관측성 개선으로 오류 감소·선제 감지 가능

![서비스 적용 화면](./assets/wrtn-ai-model-serving-image-01.png)

## 상세

**서비스 적용 계획**  
개발부터 실 적용까지 유관 부서와 대상 기능·아키텍처·전환 일정을 맞추며 phase 단위로 진행했습니다.

![서비스 적용 계획 아키텍처](./assets/wrtn-ai-model-serving-image-02.png)

**Hamlet1 / Hamlet2 비교**  
피크 시간대 기준 20분당 15,000건, RPM 750 수준을 처리했고, duration 은 20% 개선되었습니다.

![Hamlet1 Hamlet2 비교](./assets/wrtn-ai-model-serving-image-05.png)

**사전 부하 테스트**  
Gatling 기반 부하 테스트로 목표 처리량과 인프라 스펙을 사전에 검증했습니다.

<div class="img-grid-2">

![부하 테스트 결과 1](./assets/wrtn-ai-model-serving-image-03.png)

![부하 테스트 결과 2](./assets/wrtn-ai-model-serving-image-04.png)

</div>

**관측성 개선**  
AI model 호출 실패와 인프라 부하를 신규 대시보드에서 확인할 수 있도록 구성했습니다.

![AI model 호출 실패 모니터링](./assets/wrtn-ai-model-serving-image-06.png)

<div class="img-grid-3">

![인프라 부하 수준 1](./assets/wrtn-ai-model-serving-image-07.png)

![인프라 부하 수준 2](./assets/wrtn-ai-model-serving-image-08.png)

![인프라 부하 수준 3](./assets/wrtn-ai-model-serving-image-09.png)

</div>

**무중단 전환**  
기존 서비스와 신규 서비스의 전환 구간을 나누어 실서비스 기능을 무중단으로 교체했습니다.

![무중단 전환](./assets/wrtn-ai-model-serving-image-10.png)
