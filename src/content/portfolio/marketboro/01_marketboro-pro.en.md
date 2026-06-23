---
title: Marketbom Pro Development and Datadog Adoption
company: Marketboro
companySlug: marketboro
period: 2021.08 — 2022.08
order: 1
summary: Developed and operated Marketbom Pro, a B2B platform, and migrated the CloudWatch-based monitoring environment to Datadog.
tags: [Spring, Kotlin, MSA, Datadog, GraphQL]
---

## Marketbom Pro Development

I was responsible for the development and operation of Marketbom Pro, Marketboro's flagship B2B platform.

- Explored MSA approaches for integrating and operating members across heterogeneous platforms · [Do microservices also need resource synchronization?](https://hyune-c.tistory.com/entry/%EB%A7%88%EC%9D%B4%ED%81%AC%EB%A1%9C-%EC%84%9C%EB%B9%84%EC%8A%A4%EB%8F%84-%EB%A6%AC%EC%86%8C%EC%8A%A4-%EB%8F%99%EA%B8%B0%ED%99%94%EA%B0%80-%ED%95%84%EC%9A%94%ED%95%A0%EA%B9%8C?category=991435)
- Designed an architecture capable of handling high traffic · [How should large-scale data retrieval and maintenance be done?](https://hyune-c.tistory.com/entry/%EB%8C%80%EB%9F%89-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EC%A1%B0%ED%9A%8C%EC%9C%A0%EC%A7%80%EB%B3%B4%EC%88%98%EB%8A%94-%EC%96%B4%EB%96%BB%EA%B2%8C-%ED%95%B4%EC%95%BC%EB%90%A0%EA%B9%8C?category=991435)
- Refactored the legacy logic that calls KakaoTalk notification messages · [For a loosely coupled design!](https://hyune-c.tistory.com/32)

## Datadog Adoption to Strengthen Company-wide Logging

- Migrated the CloudWatch-based monitoring environment to Datadog · [A taste of GraphQL monitoring in Datadog](https://hyune-c.tistory.com/entry/Datadog-%EC%97%90%EC%84%9C-GraphQL-%EB%AA%A8%EB%8B%88%ED%84%B0%EB%A7%81-%EB%A7%9B%EB%B3%B4%EA%B8%B0?category=989703)
- Researched custom approaches (span, tag) to solve the problem of all entry points being unified under `POST /graphql`
- Coordinated non-development work with Bespin Global (costs, adoption methods, etc.), and improved the Dockerizing and deployment process
