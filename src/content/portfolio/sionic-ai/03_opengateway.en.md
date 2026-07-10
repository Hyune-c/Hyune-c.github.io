---
title: OpenGateway Development/Operations
company: Sionic AI
companySlug: sionic-ai
period: 2024.09 — now
order: 1
summary: Extended an internal model routing engine into an OpenAI-compatible public API Gateway product. Serving RPM 200, Daily 280K, 10+ Providers, 100+ Models.
tags: [API Gateway, Model Routing, Prompt Cache, Spring, Kotlin, Billing, Multi-deployment]
---

## Background

[OpenGateway](https://opengateway.ai/) is an AI Gateway that serves multiple Model Providers through an OpenAI-compatible API.  
It was initially developed as a feature used only by internal services, but as external customers wanting model routing emerged, the need arose to extend it into a standalone API product.

- Parameter compatibility and routing quality had to be maintained even as models and Providers changed across SaaS / airgap environments
- Considering zone separation such as `kr` and `jp` and airgap support, the internal composition needed to be flexibly assembled while preserving the OpenAI API spec

## Outcomes

- [opengateway.ai](https://opengateway.ai/) — live service
- Extended the existing internal model serving feature into an OpenAI-compatible public API Gateway product, building out every flow including API Key, Authn/Authz, Billing, Logs, and the frontend UI
- Designed availability-first routing, Prompt Cache stickiness, parameter/error normalization, and a shared compatibility Mapper delegation structure, enabling consistent expansion to 10+ Providers under a single OpenAI spec
- Stably serving traffic at the level of RPM 200 and Daily 280K, with 10+ Providers and 100+ models
- Connected Redeem Code, Admin features, Grafana observability, and model smoke/CI/daily tests to improve both operational observability and live stability

## Design and Implementation

To plan and develop 2 backends and 1 frontend simultaneously with one junior developer, I had to make active use of AI.

- Kept policies and work standards as a single source of truth in Skills, so that humans and AI could work in the same context
- Separated the flows to be controlled from dynamic decision-making in the system, clearly distinguishing the areas to review directly from the areas to delegate to AI
- More details are documented in [Thoughts on development that actively leverages AI](/en/portfolio/sionic-ai/05_ai-development-workflow/)

![OpenGateway end-to-end flow — separation of engine and back office](./assets/opengateway-architecture.en.svg)

![Core design — Facade · routing · error normalization](./assets/opengateway-facade-router.en.svg)

![Parameter normalization and transparency](./assets/opengateway-normalization.en.svg)

![Core design — Provider extension structure](./assets/opengateway-mapper-layers.en.svg)

![Billing pipeline](./assets/opengateway-billing.en.svg)

### Front Office

![OpenGateway Dashboard — API usage and performance monitoring](./assets/opengateway-dashboard.png)

*Front Office dashboard with API usage, traffic, and performance metrics.*

<div class="img-grid-2">

<figure class="grid-cap">

![OpenGateway Logs](./assets/opengateway-image-04.png)

*Request logs list with per-call status, model, and timing.*

</figure>

<figure class="grid-cap">

![OpenGateway Log Detail](./assets/opengateway-image-05.png)

*Single log detail view showing request, routing, and response data.*

</figure>

</div>

### Docs

![OpenGateway Documentation — docs and API reference](./assets/opengateway-docs.png)

*Developer docs site with guides and OpenAI-compatible API reference.*

## Operational Stabilization

- Managed operational status using Grafana to observe traffic, cost, response time, and Provider distribution
- Standardized recurring operational tasks such as model addition/removal, SDK upgrades, releases, and weekly reports into Claude Skills, improving operational convenience
- Applied smoke tests, CI tests, and daily jobs to 10+ Providers and 100+ models to continuously verify live environment stability

![OpenGateway Grafana Dashboard](./assets/opengateway-image-02.png)

*Grafana dashboard tracking traffic, cost, latency, and Provider distribution.*

![OpenGateway live smoke test results](./assets/opengateway-smoke-test-live.png)

*Live smoke-test results verifying Providers and models in production.*
