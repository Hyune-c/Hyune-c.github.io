---
title: OutOfMemoryError During Batch Jobs
company: Kurly Pay
companySlug: kurlypay
period: 2022.09 — 2023.12
order: 6
group: troubleshooting
summary: With the owner having left the company, applied a short-term mitigation for batch OOM and drove a company-wide memory optimization.
tags: [Troubleshooting, Memory, Batch]
---

## Issue

- An OutOfMemoryError occurred during a batch job while the responsible owner had already left the company
- I analyzed the segments where memory usage increased, proposed a short-term mitigation, and then carried it forward into a company-wide memory optimization

## Analysis

After receiving the issue report, I checked the OOM error logs and confirmed that memory had peaked during that time window.

<div class="img-grid-2">

![Issue report / OOM error log](./assets/kurly-oom-image-01.png)

*Issue report alongside the OutOfMemoryError log from the batch job.*

![Memory peak confirmed for that time window](./assets/kurly-oom-image-02.png)

*Memory usage chart confirming the peak during that time window.*

</div>

Rather than treating it as a simple OOM issue, I went one step further and discovered that the JVM memory settings themselves were misconfigured.

![JVM default max heap size analysis](./assets/kurly-oom-image-03.png)

*Analysis of the misconfigured JVM default max heap size.*

## Improvement

I improved the JVM memory options in the Dockerfile and shared the same pattern company-wide so it could be applied consistently.

![Follow-up plan (Xmx, autoscaling, log alerts)](./assets/kurly-oom-image-04.png)

*Follow-up plan covering Xmx tuning, autoscaling, and log alerts.*

![Dockerfile JVM option change request](./assets/kurly-oom-image-06.png)

*Change request applying the JVM memory options in the Dockerfile.*

After the infrastructure work, I confirmed on reprocessing that memory operated stably at up to 553MB.

![Reprocessing memory usage confirmed](./assets/kurly-oom-image-05.png)

*Reprocessing run confirming stable memory usage up to 553MB.*
