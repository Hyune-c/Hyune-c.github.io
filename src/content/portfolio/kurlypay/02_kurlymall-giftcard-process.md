---
title: 컬리몰 상품권 구매 프로세스 개선
company: 컬리페이
companySlug: kurlypay
period: 2022.09 — 2023.12
order: 2
summary: 장애 시 데이터 불일치를 Kafka 기반 결과적 일관성으로 복구 가능한 구조로 재설계. Go 레거시와 Kotlin/Spring 신규 흐름 연계.
tags: [Kafka, Eventual Consistency, Migration]
---

## 배경

런칭 후 장애가 발생하면 컬리/컬리페이 간 데이터 불일치가 생기고, 운영자가 수동으로 대응해야 하는 구조였습니다.  
기존 Go 로직과 Kotlin/Spring 신규 흐름이 공존하던 상황이라, 두 흐름을 연계하면서 일관성을 회복할 방안이 필요했습니다.

## 성과

- Kafka 기반 결과적 일관성으로 장애 시 자동 복구 가능한 구조로 재설계
- Go 레거시와 Kotlin/Spring 신규 흐름을 동시 운영하면서 점진적으로 전환 가능한 기반 확보

## 상세

**문제점 정리 및 TO-BE 설계**

![문제점 / TO-BE 정리](./assets/kurlymall-giftcard-process-image-01.png)

**아키텍처 변경**

<div class="img-grid-2-labeled">

**AS-IS (Polling 방식)**

**TO-BE (Kafka 이벤트 기반)**

![Polling 기반 아키텍처](./assets/kurlymall-giftcard-process-image-02.png)

![Kafka 이벤트 기반 아키텍처](./assets/kurlymall-giftcard-process-image-03.png)

</div>

**기타 운영 고려사항**

<div class="img-grid-2" style="grid-template-columns: 2fr 1fr;">

![어뷰징 시나리오](./assets/kurlymall-giftcard-process-image-04.png)

![3P 파트너오피스 연동 위키 구조](./assets/kurlymall-giftcard-process-image-05.png)

</div>
