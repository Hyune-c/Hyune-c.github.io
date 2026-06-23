---
title: Company-wide Common Service (CDS) Development & Operations
company: Wrtn
companySlug: wrtn
period: 2024.01 — 2024.07
order: 2
summary: Provided functionality shared across multiple services through an API server (tokenizer, email validation, profanity detection, etc.). The following describes the tokenizer, its representative feature.
tags: [Python, FastAPI, Tiktoken]
---

## Background

GPT-4o uses a different encoding scheme from previous models, which introduced errors in the existing token-counting logic.

- Token counting is directly tied to cost estimation and usage control, so a fast response was required
- Since OpenAI's official token-counting library was provided in Python, rather than forcing it into the Kotlin/JVM services, I separated it out as a distinct feature within CDS

![Token-counting library dependency](./assets/wrtn-tokenizer-image-01.png)

*Diagram showing why the Python token-counting library was isolated within CDS.*

## Outcomes

- Internal services could now reliably use the calculation logic needed for AI cost optimization and pre-emptive usage validation
- Through pre-launch load testing, I verified request handling at around RPS 400 and the corresponding infrastructure specs

## Details

- Used OpenAI's official Tiktokenizer library to provide per-model token counting

![Load test summary](./assets/wrtn-tokenizer-image-02.png)

*Load test summary confirming request handling at around RPS 400.*

<div class="img-grid-2">

![Load test result 1](./assets/wrtn-tokenizer-image-03.png)

*Load test result verifying tokenizer throughput before launch.*

![Load test result 2](./assets/wrtn-tokenizer-image-04.png)

*Additional load test result confirming corresponding infrastructure specs.*

</div>
