---
title: 마켓봄 프로 개발 및 Datadog 도입
company: 마켓보로
companySlug: marketboro
period: 2021.08 — 2022.08
order: 1
summary: B2B 플랫폼 마켓봄 프로 개발·운영 및 cloudwatch 기반 관제 환경을 Datadog으로 전환.
tags: [Spring, Kotlin, MSA, Datadog, GraphQL]
---

## 마켓봄 프로 개발

마켓보로의 대표 B2B 플랫폼인 마켓봄 프로의 개발과 운영을 담당했습니다.

- 이종 플랫폼의 회원 통합 및 운영 방법에 대한 MSA 고민 · [마이크로 서비스도 리소스 동기화가 필요할까?](https://hyune-c.tistory.com/entry/%EB%A7%88%EC%9D%B4%ED%81%AC%EB%A1%9C-%EC%84%9C%EB%B9%84%EC%8A%A4%EB%8F%84-%EB%A6%AC%EC%86%8C%EC%8A%A4-%EB%8F%99%EA%B8%B0%ED%99%94%EA%B0%80-%ED%95%84%EC%9A%94%ED%95%A0%EA%B9%8C?category=991435)
- 높은 트래픽에 대응할 수 있는 아키텍처 설계 · [대량 데이터 조회와 유지보수는 어떻게 해야될까?](https://hyune-c.tistory.com/entry/%EB%8C%80%EB%9F%89-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EC%A1%B0%ED%9A%8C%EC%9C%A0%EC%A7%80%EB%B3%B4%EC%88%98%EB%8A%94-%EC%96%B4%EB%96%BB%EA%B2%8C-%ED%95%B4%EC%95%BC%EB%90%A0%EA%B9%8C?category=991435)
- 카카오 알림톡을 호출하는 레거시 로직 리팩토링 · [느슨한 결합도의 설계를 위해!](https://hyune-c.tistory.com/32)

## 전사 로깅 강화를 위한 Datadog 도입

- cloudwatch 기반의 관제 환경을 Datadog 으로 전환 · [Datadog 에서 GraphQL 모니터링 맛보기](https://hyune-c.tistory.com/entry/Datadog-%EC%97%90%EC%84%9C-GraphQL-%EB%AA%A8%EB%8B%88%ED%84%B0%EB%A7%81-%EB%A7%9B%EB%B3%B4%EA%B8%B0?category=989703)
- 진입점이 `POST /graphql` 로 통일되는 문제를 해결하기 위해 커스텀 방법(span, tag)을 연구
- 베스핀글로벌과 비개발 영역 업무 협의 (비용, 도입 방법 등), 도커라이징 및 배포 프로세스 개선
