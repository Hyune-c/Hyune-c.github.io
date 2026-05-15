---
title: 상품권코드 없이 상품권 조회 API가 호출되는 현상
company: 컬리페이
companySlug: kurlypay
period: 2022.09 — 2023.12
order: 8
group: troubleshooting
summary: VOC로 드러나지 않던 잘못된 API 호출을 모니터링으로 선제 확인 후 후속 처리.
tags: [Troubleshooting, Monitoring]
---

## 이슈 상황

- 추석 연휴 기간 상품권 API 모니터링 중, 1주일간 42건의 비정상 호출을 발견했습니다
- VOC 로 들어온 이슈는 없었지만 UX 영향이 있을 수 있다고 판단했습니다

![이슈 발견 배경](./assets/kurly-missing-giftcard-code-image-01.png)

## 분석

Datadog 으로 확인해보니 querystring 의 `redeemcode` 가 빈 문자열로 들어오는 케이스가 있었습니다.

![Datadog 확인](./assets/kurly-missing-giftcard-code-image-02.png)

Kibana 로 추가 확인한 결과, 정상 호출 200건과 빈 문자열 42건이 함께 들어오고 있었고 빈 문자열 케이스에서 에러가 발생하고 있었습니다.

![Kibana 확인](./assets/kurly-missing-giftcard-code-image-03.png)

## 개선

호출 조건을 분석한 뒤 담당자에게 요청하여 후속 처리를 진행했습니다.
