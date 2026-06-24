---
title: Thoughts on Development That Actively Leverages AI
company: Sionic AI
companySlug: sionic-ai
period: 2024.09 — now
order: 5
summary: Separating the flows humans must control from the areas that can be delegated to AI. Harness engineering that manages policies, research, and Skills as a single source of truth.
tags: []
---

AI has become an essential tool for hands-on development. But even with the same tool, the quality of the results varies greatly depending on proficiency.

- Tools like the Ralph Loop can produce results quickly, but edge cases, exception handling, and failure recovery are easily missed; in areas that handle large amounts of tacit knowledge, like B2B agents, it is hard to produce stable results with models and prompts alone
- Hyped terms like Agentic Coding, Harness Engineering, and Hermes change quickly, but the essence remains unchanged: it is ultimately about **designing workflows to handle AI well**
- Rather than just chasing new tools, what matters more is CS fundamentals, intuition born from experience, controlling code smells and complexity, and the ability to critically accept AI's plausible-sounding answers

## Separating the Controlled Domain from the Delegated Domain

I believe the most important decision in leveraging AI is **separating the areas that must be controlled from the areas that can be delegated**. In practice, what matters more is not just that something works, but the consistency and sustainability needed for operations.

- **Areas that must be controlled** — domain rules, business flows, state transitions, authentication/billing, failure recovery, external API specs
- **Areas that can be delegated** — idempotently testable components, UI composition, repetitive boilerplate, document drafts

To clearly divide the two areas, paradoxically, you have to spend **more time on design and documentation**. Layer design must come first to carve out the controlled domain, and in that process concerns are naturally separated while decisions are left behind as documentation.

This is closer to divide-and-conquer than delegating the whole thing. The scope requiring human intervention is reduced, and the delegated parts are verified through tests and contracts alone. From this perspective, a **Facade + multi-module** structure fit better than the commonly cited Hexagonal or OOP. Control flows are gathered in one place in the Facade, and the rest is separated into components with clear input/output contracts.

### Regression Tests and Code Review

Once this structure was in place, I leave the code writing itself to AI and **spend more time on the design, code review, and PR review of the controlled domain**. The reason I spend time on the controlled domain is to control AI's hallucinations and make better design decisions based on domain knowledge; the delegated domain is the part that is naturally separated as a result of that good design, so it can be safely entrusted to AI.

What safely underpins this flow is regression tests of the controlled domain. They automatically verify that the controlled domain does not break amid the changes AI produces rapidly.

- I define core call paths as input condition matrices and call them against the actual production environment to verify they satisfy the expected results
- When there are practical constraints on building tests, I supplement with a QA stage

## [OpenGateway](/en/portfolio/sionic-ai/03_opengateway/) is a case that applies these ideas well

Even while planning and developing 2 backends and 1 frontend simultaneously with one junior developer, I maintained consistent context and policies.

- I tied together 4 repositories — 2 backends, 1 frontend, and 1 policy repo — with Skills and managed them as a single source of truth
- To maintain consistency across long conversations with AI and to share domain knowledge with colleagues, I introduced the **handoff concept under the name of research documents**, writing them separated into visible material for humans to read and content for AI
- Complex topics are staged as **research document → peer review → promotion to official policy**, so research documents are naturally reused as the basis for past decisions and as the foundation for re-investigation

<div class="img-grid-2" style="grid-template-columns: 1fr 2fr;">

<figure class="grid-cap">

![OpenGateway research document management structure](./assets/ai-development-workflow-image-01.png)

*Folder structure organizing OpenGateway research documents as a single source of truth.*

</figure>

<figure class="grid-cap">

![OpenGateway research document example (Prompt Cache routing design)](./assets/ai-development-workflow-image-02.png)

*A sample research document detailing the Prompt Cache routing design.*

</figure>

</div>

- Applied regression tests to core features to verify that key behaviors do not break at each change point

![OpenGateway smoke test detailed results](./assets/opengateway-smoke-test-detail.png)

*Detailed OpenGateway smoke test results verifying core call paths pass.*

## Active Experimentation and Learning

I do not always use AI under strict control. Because I believe you need to know both sides to derive better methodologies, I actively delegate in side projects or minor development items where the impact scope is limited.

- [read4ai](https://github.com/read4ai/read4ai-excel), a side project built with frontend and Python development and the philosophy of `merging without looking at the code`
- I take interest in the Claude Code version history and call the LLM API directly to learn what can be applied to workflows
- I continuously adjust my tooling as well. Starting from a `cmux + Claude Code + Codex plugin` combination, I have currently shifted toward Codex due to the perceived performance drop after Opus 4.7
- I gather AI information through LinkedIn, GeekNews, release notes, and more, and share it with the team
