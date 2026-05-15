---
title: 배치 작업간 OutOfMemoryError 발생
company: 컬리페이
companySlug: kurlypay
period: 2022.09 — 2023.12
order: 6
group: troubleshooting
summary: 담당자 퇴사 상태에서 배치 OOM 단기 완화·전사 메모리 최적화 진행.
tags: [Troubleshooting, Memory, Batch]
---

## 이슈 상황

- 담당자가 퇴사한 상태에서 배치 작업 중 OutOfMemoryError 가 발생했습니다
- 메모리 사용량이 증가하는 구간을 분석해 단기 완화 방법을 제시했고, 이후 전사 메모리 최적화 작업까지 이어갔습니다

## 분석

이슈 리포트를 받아 OOM 에러 로그를 확인하고, 해당 시간대에 메모리가 피크로 올라간 것을 확인했습니다.

<div class="img-grid-2">

![이슈 리포트 / OOM 에러 로그](./assets/kurly-oom-image-01.png)

![해당 시간대 메모리 피크 확인](./assets/kurly-oom-image-02.png)

</div>

단순한 OOM 이슈로 끝내지 않고 한 단계 더 들어가, JVM 메모리 설정 자체가 잘못되어 있는 것을 발견했습니다.

![JVM Default Max Heap 사이즈 분석](./assets/kurly-oom-image-03.png)

## 개선

Dockerfile 의 JVM 메모리 옵션을 개선하고, 동일한 패턴이 적용될 수 있도록 전사에 전파했습니다.

![이후 작업 계획 (Xmx, 오토스케일링, 로그 알림)](./assets/kurly-oom-image-04.png)

![Dockerfile JVM 옵션 변경 요청](./assets/kurly-oom-image-06.png)

인프라 작업 후 재처리 시 메모리가 553MB 까지 안정적으로 동작하는 것을 확인했습니다.

![재처리 메모리 사용량 확인](./assets/kurly-oom-image-05.png)
