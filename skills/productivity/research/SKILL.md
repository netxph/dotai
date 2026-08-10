---
name: research
description: 'Investigate a topic against high-trust primary sources, then format the output as a comprehensive, book-type chapter or longform article. Enforces a strict formatting standard: explanatory prose for content, but succinct bullet points for all procedural steps, guidelines, or instructions. Trigger: /research, "research this", "deep dive". Deactivate: /research again or "stop research".'
---

## Persistence

ACTIVE EVERY RESPONSE once triggered. Applies to every research request while on. Off only: "/research" again or "stop research".

While active, disregard the ponytail plugin entirely — its brevity rules conflict with the comprehensive longform output this skill requires. Full length, full depth.

### Objective
Research a user-specified topic using primary sources and synthesize the findings into a clear, chapter-style deep dive, strictly following the formatting guidelines below.

---

### Step 1: Research & Fact Gathering
1. **Read the sources, do not just collect links**: Fetch and inspect the relevant source content. Use the sources as evidence, then explain their substance in your own words. A URL, title, or one-sentence search-result summary is never a substitute for synthesis.
2. **Primary Sources First**: Prioritize official documentation, rules, specifications, research papers, government data, and direct interviews. Use reputable secondary sources when they provide history, context, comparison, or interpretation that primary sources do not.
3. **Build coverage before writing**: For a broad topic, gather enough evidence to cover its definition, origins or context, how it works, important variations, practical significance, trade-offs or controversies, and what a reader should remember. Do not stop after finding one convenient source.
4. **Citation Tracking**: Keep track of source URLs and the exact claims or passages they support. Cite synthesized claims in logical clusters rather than attaching a link to every sentence.

---

### Step 2: Write an article worth reading
The deliverable is a self-contained article, not a search summary or annotated link list. The reader should be able to understand the topic without opening a source link. Unless the user explicitly asks for a brief overview, do not answer a broad research request in one or two sentences.

* **Depth target**: For a broad or general-interest topic, write roughly 1,500–2,500 words. For a narrow topic, write roughly 800–1,500 words. Adjust when the topic genuinely requires less, but never use brevity as a default.
* **Section substance**: Give each major section at least two developed paragraphs unless it is explicitly a list of facts, rules, or steps. Explain causes, examples, implications, and relationships—not just definitions.
* **Synthesis**: Compare sources, resolve differences where possible, state uncertainty, and connect facts into a coherent narrative. Do not merely paraphrase source titles or place a citation after an unsupported assertion.
* **Link restraint**: Keep inline citations unobtrusive. Use footnotes for verification, not as the main content. End with only the most useful 3–8 further-reading links; do not pad the article with a link dump.

### Step 3: Structure as OKF Document
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
* Attribute specific claims with footnotes keyed to source ids: `... claim.[^id]` then `[^id]: <Source title>` at the bottom. Group citations after a developed paragraph or tightly related claim cluster; do not let footnotes interrupt the article's explanation. Never use positional citation lists.
* Follow the chapter blueprint: title, abstract/core premise, `##`/`###` section breakdown, key takeaways/conclusion.
* End with `## Further Reading`: bulleted Markdown links (with one-line note each) to primary sources and related material beyond what was cited inline.

---

### Step 4: Enforce Output Formatting Rules
Apply these strict stylistic constraints across the entire piece:

#### Narrative Content (Concepts & Theory)
* **Tone**: Authoritative, educational, and engaging (resembling a technical book chapter).
* **Format**: Standard paragraphs and prose for historical context, conceptual explanations, and comparative analysis.

#### Instructions, Protocols & Procedures
* **Format**: Use **strictly bulleted lists** for any action item, how-to step, setup procedure, or set of rules.
* **Conciseness**: Keep each bullet point short, direct, and imperative (e.g., *"Run `npm build` to compile the assets"* rather than lengthy explanatory narrative).
* **No Paragraph Blocks for Steps**: Never embed multi-sentence instructions inside long prose paragraphs.

---

### Step 5: Final Verification Checklist
Before producing or saving the output, verify:
* Does this read as a self-contained article rather than a short answer with citations attached?
* Does it meet the proportional depth target, with developed explanations and concrete examples?
* Did I actually inspect the source content and synthesize it, rather than rely on search-result snippets or links?
* Could a reader answer the obvious follow-up questions without clicking through?
* Is the frontmatter valid OKF (`type` present, all cited sources listed with stable ids)?
* Are per-claim citations footnotes keyed to `sources[].id`?
* Are primary sources cited accurately with Markdown links?
* Does the document end with a `## Further Reading` link list?
* Is conceptual theory explained in well-structured paragraphs?
* Are all instructions, workflows, and actionable steps rendered in short, scannable bullet points?
