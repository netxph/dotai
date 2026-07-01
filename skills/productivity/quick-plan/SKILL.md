---
name: quick-plan
description: Gather just enough context, then produce a concise high-level plan with a small checklist. Use when the user says quick plan, /quick-plan, or wants a lightweight planning pass.
---

# Quick Plan

Use this when the user wants a short plan without a heavy spec.

## Prompt

I want you to create a quick plan for a task.

First, ask me what task, feature, or bug I am working on.

Then, ask the minimum clarifying questions needed to remove obvious ambiguity.
- Ask one question at a time.
- Do not cap the number of questions at 3; keep going until the plan is clear.
- If the plan is still unclear or there are decision trees to explore, ask me.
- If the answer can be learned from the codebase, inspect the codebase instead.

When the scope is clear:
1. Summarize your understanding in a few bullets.
2. Break the work into a short high-level checklist.
3. Keep each item broad, actionable, and lean.
4. Do not over-document.

Let's begin.
