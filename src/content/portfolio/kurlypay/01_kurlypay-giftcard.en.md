---
title: Kurly Pay Gift Card Design, Development, and Operations
company: Kurly Pay
companySlug: kurlypay
period: 2022.09 — 2023.12
order: 1
summary: Supported 4 use cases (B2C/B2B/corporate card/individual bulk purchase), separated external-partner and Kurly Mall flows, and handled the gift card lifecycle via Kafka.
tags: [Spring, Kafka, B2B, B2C, Payment]
---

## Background

Gift cards mixed external-partner flows with Kurly Mall flows, making them hard to handle with a single structure.  
Use cases were diverse — B2C orders, B2B purchases, corporate card and individual bulk purchases — so each required its own design and operational standards.

## Outcomes

- Supported 4 use cases: external-partner B2B, Kurly Mall B2C, corporate card, and individual bulk purchase
- Clarified flow and responsibility boundaries by separating the gateway and core servers for external partners
- Ensured consistency in asynchronous flows by designing the gift card lifecycle to be processed via Kafka

## Details

I owned the design, development, and operation of gift cards, including planning research and communication with partners, Kurly, and outsourced partner companies.

- Developed the contract/product relationships and the gift card issuance flow
- Designed the separation of gateway and core servers for external partners, and the separation of the B2C Kurly Mall order flow from the B2B purchase flow
- Designed Kafka-based processing for the gift card lifecycle

![Gift card architecture overview](./assets/kurlypay-giftcard-image-01.png)

*Overall architecture: external-partner gateway/core separation, B2C/B2B flow split, and Kafka.*

<div class="img-grid-2">

<figure class="grid-cap">

![Purchase to issue-and-send sequence](./assets/kurlypay-giftcard-image-02.png)

*Sequence for purchasing, then issuing and sending a gift card (order polling → send → notification).*

</figure>

<figure class="grid-cap">

![Kafka publish events per gift card action](./assets/kurlypay-giftcard-image-03.png)

*Kafka events published per gift card action (issue, send, resend, use, terminate).*

</figure>

</div>
