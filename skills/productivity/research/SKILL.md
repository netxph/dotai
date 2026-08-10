---
name: research
description: 'Investigate a topic against high-trust primary sources, then format the output as a comprehensive, book-type chapter or longform article. Enforces a strict formatting standard: explanatory prose for content, but succinct bullet points for all procedural steps, guidelines, or instructions. Trigger: /research, "research this", "deep dive". Deactivate: /research again or "stop research".'
---

## Persistence

ACTIVE EVERY RESPONSE once triggered. Applies to every research request while on. Off only: "/research" again or "stop research".

### Objective
Research a user-specified topic using primary sources and synthesize the findings into a clear, chapter-style deep dive, strictly following the formatting guidelines below.

---

### Step 1: Research & Fact Gathering
1. **Primary Sources First**: Prioritize official documentation, specifications, source code, or authoritative whitepapers over secondary opinions.
2. **Citation Tracking**: Keep track of primary URLs and source origin points for every major claim made.

---

### Step 2: Structure as OKF Document
Output a single markdown document conforming to the [Open Knowledge Format](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md) (OKF v0.2):

#### Frontmatter (required)
```yaml
---
type: Reference
title: <display name>
description: <one-line summary>
tags: [<tag>, ...]
generated: { by: <agent/model>, at: <ISO 8601 datetime> }
sources:
  - id: <stable-key>
    resource: <primary source URL>
    title: <label>
    last_modified: <YYYY-MM-DD, if known>
---
```
* `type` is the only strictly required key; use `Reference` for research deep dives.
* Every major source cited in the body MUST appear as a `sources` entry with a stable `id`.

#### Body
* Attribute specific claims with footnotes keyed to source ids: `... claim.[^id]` then `[^id]: <Source title>` at the bottom. Never use positional citation lists.
* Follow the chapter blueprint: title, abstract/core premise, `##`/`###` section breakdown, key takeaways/conclusion.
* End with `## Further Reading`: bulleted Markdown links (with one-line note each) to primary sources and related material beyond what was cited inline.

---

### Step 3: Enforce Output Formatting Rules
Apply these strict stylistic constraints across the entire piece:

#### Narrative Content (Concepts & Theory)
* **Tone**: Authoritative, educational, and engaging (resembling a technical book chapter).
* **Format**: Standard paragraphs and prose for historical context, conceptual explanations, and comparative analysis.

#### Instructions, Protocols & Procedures
* **Format**: Use **strictly bulleted lists** for any action item, how-to step, setup procedure, or set of rules.
* **Conciseness**: Keep each bullet point short, direct, and imperative (e.g., *"Run `npm build` to compile the assets"* rather than lengthy explanatory narrative).
* **No Paragraph Blocks for Steps**: Never embed multi-sentence instructions inside long prose paragraphs.

---

### Step 4: Final Verification Checklist
Before producing or saving the output, verify:
* Is the frontmatter valid OKF (`type` present, all cited sources listed with stable ids)?
* Are per-claim citations footnotes keyed to `sources[].id`?
* Are primary sources cited accurately with Markdown links?
* Does the document end with a `## Further Reading` link list?
* Is conceptual theory explained in well-structured paragraphs?
* Are all instructions, workflows, and actionable steps rendered in short, scannable bullet points?
