---
title: 통계 모니터링 구성 및 확장 리서치
company: 컬리페이
companySlug: kurlypay
period: 2022.09 — 2023.12
order: 4
summary: Redash 기반 대시보드 구성 및 확장성 있는 통계 구조 리서치.
tags: [Redash, Monitoring, Statistics]
---

## 배경

비개발자(운영/기획)가 주요 지표를 확인하려면 개발자에게 매번 요청해야 했습니다.  
빠른 확인이 가능한 대시보드가 필요했고, 이후 단순 쿼리 공유를 넘는 통계 구조도 함께 고민했습니다.

## 성과

- Redash 기반 대시보드 구성으로 비개발자가 직접 주요 지표 확인 가능
- 운영/기획에서 자주 사용하는 쿼리·조회 흐름 정리
- 데이터 모델, 집계 방식, 조회 성능, 운영 편의성을 고려한 확장 가능한 통계 구조 리서치

## 상세

**Redash 기반 모니터링 구성**

![결제수단·점유율 차트](./assets/kurly-redash-image-02.png)

<div class="img-grid-2">

![상품권 기본 통계 대시보드](./assets/kurly-redash-image-01.png)

![상품권 발행 시계열 그래프](./assets/kurly-redash-image-03.png)

</div>

**확장성 있는 데이터 통계 리서치**

Redash 운영 이후, 단순 쿼리 공유를 넘어 데이터 모델, 집계 방식, 조회 성능, 운영 편의성을 함께 고려한 통계 구조를 리서치했습니다.

<div class="img-grid-3">

![배경 (논의 / 기존 방식 정리)](./assets/kurly-statistics-image-01.png)

![목표 (자동화 대상 통계 정의)](./assets/kurly-statistics-image-02.png)

![계획 (ETL/ELT, AWS Pipeline 학습)](./assets/kurly-statistics-image-03.png)

</div>
