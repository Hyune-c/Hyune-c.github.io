---
title: Gift Card Lookup API Being Called Without a Gift Card Code
company: Kurly Pay
companySlug: kurlypay
period: 2022.09 — 2023.12
order: 8
group: troubleshooting
summary: Proactively detected invalid API calls that had not surfaced as VOCs through monitoring, then handled the follow-up.
tags: [Troubleshooting, Monitoring]
---

## Issue

- While monitoring the gift card API during the Chuseok holiday, I found 42 abnormal calls over the course of a week
- No issues had come in as VOCs, but I judged there could be a UX impact

![Background of issue discovery](./assets/kurly-missing-giftcard-code-image-01.png)

*Background on discovering the abnormal calls while monitoring during Chuseok.*

## Analysis

Checking with Datadog, I found cases where the querystring's `redeemcode` came in as an empty string.

![Datadog check](./assets/kurly-missing-giftcard-code-image-02.png)

*Datadog showing the querystring redeemcode arriving as an empty string.*

Additional verification with Kibana showed 200 normal calls and 42 empty-string calls coming in together, with errors occurring in the empty-string cases.

![Kibana check](./assets/kurly-missing-giftcard-code-image-03.png)

*Kibana showing 200 normal calls alongside 42 erroring empty-string calls.*

## Improvement

After analyzing the call conditions, I requested the responsible owner to carry out the follow-up handling.
