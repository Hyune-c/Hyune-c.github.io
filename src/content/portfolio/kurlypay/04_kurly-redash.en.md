---
title: Building Statistics Monitoring and Researching Scalability
company: Kurly Pay
companySlug: kurlypay
period: 2022.09 — 2023.12
order: 4
summary: Built Redash-based dashboards and researched a scalable statistics architecture.
tags: [Redash, Monitoring, Statistics]
---

## Background

For non-developers (operations/planning) to check key metrics, they had to request them from developers every time.  
A dashboard that enabled quick checks was needed, and I later considered a statistics structure that went beyond simple query sharing.

## Outcomes

- Enabled non-developers to check key metrics directly through Redash-based dashboards
- Organized the queries and lookup flows frequently used by operations/planning
- Researched a scalable statistics architecture considering the data model, aggregation methods, query performance, and operational convenience

## Details

**Redash-based monitoring setup**

![Payment method / share chart](./assets/kurly-redash-image-02.png)

*Redash chart showing payment method breakdown and share.*

<div class="img-grid-2">

<figure class="grid-cap">

![Gift card basic statistics dashboard](./assets/kurly-redash-image-01.png)

*Redash dashboard of basic gift card statistics for operations.*

</figure>

<figure class="grid-cap">

![Gift card issuance time-series graph](./assets/kurly-redash-image-03.png)

*Time-series graph tracking gift card issuance over time.*

</figure>

</div>

**Research into scalable data statistics**

After operating Redash, I researched a statistics architecture that went beyond simple query sharing to jointly consider the data model, aggregation methods, query performance, and operational convenience.

<div class="img-grid-3">

<figure class="grid-cap">

![Background (discussion / summary of existing approach)](./assets/kurly-statistics-image-01.png)

*Background discussion summarizing the existing query-sharing approach.*

</figure>

<figure class="grid-cap">

![Goal (defining the statistics to automate)](./assets/kurly-statistics-image-02.png)

*Goal definition for the statistics to be automated.*

</figure>

<figure class="grid-cap">

![Plan (ETL/ELT, AWS Pipeline study)](./assets/kurly-statistics-image-03.png)

*Plan studying ETL/ELT and AWS Pipeline for scalable statistics.*

</figure>

</div>
