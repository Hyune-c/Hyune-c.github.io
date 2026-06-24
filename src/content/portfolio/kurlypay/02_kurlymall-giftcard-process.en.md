---
title: Improving the Kurly Mall Gift Card Purchase Process
company: Kurly Pay
companySlug: kurlypay
period: 2022.09 — 2023.12
order: 2
summary: Redesigned data inconsistencies during failures into a Kafka-based eventually consistent structure that could self-recover, connecting the Go legacy with the new Kotlin/Spring flow.
tags: [Kafka, Eventual Consistency, Migration]
---

## Background

After launch, any failure caused data inconsistencies between Kurly and Kurly Pay, requiring operators to respond manually.  
With the legacy Go logic and the new Kotlin/Spring flow coexisting, we needed a way to connect the two flows while restoring consistency.

## Outcomes

- Redesigned the structure into Kafka-based eventual consistency capable of self-recovering during failures
- Established a foundation for gradual migration while running the Go legacy and the new Kotlin/Spring flow simultaneously

## Details

**Problem analysis and TO-BE design**

![Problem / TO-BE summary](./assets/kurlymall-giftcard-process-image-01.png)

*Summary of the failure-driven inconsistency problem and the TO-BE design.*

**Architecture change**

<div class="img-grid-2-labeled">

**AS-IS (polling-based)**

**TO-BE (Kafka event-based)**

<figure class="grid-cap">

![Polling-based architecture](./assets/kurlymall-giftcard-process-image-02.png)

*AS-IS polling-based architecture between Kurly and Kurly Pay.*

</figure>

<figure class="grid-cap">

![Kafka event-based architecture](./assets/kurlymall-giftcard-process-image-03.png)

*TO-BE Kafka event-based architecture enabling eventual consistency.*

</figure>

</div>

**Other operational considerations**

<div class="img-grid-2" style="grid-template-columns: 2fr 1fr;">

<figure class="grid-cap">

![Abuse scenarios](./assets/kurlymall-giftcard-process-image-04.png)

*Analysis of abuse scenarios considered during the redesign.*

</figure>

<figure class="grid-cap">

![3P Partner Office integration wiki structure](./assets/kurlymall-giftcard-process-image-05.png)

*Wiki structure documenting the 3P Partner Office integration.*

</figure>

</div>
