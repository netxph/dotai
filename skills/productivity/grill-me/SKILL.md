---
name: grill-me
description: Interrogates the user to resolve design dependencies and outputs a clean Markdown plan for execution.
---

# Grill Me (Scoping & Planning Version)

Ask the agent to stress-test your implementation ideas before writing code.

## Prompt

I want you to act as a rigorous technical architect and grill me on a specific engineering task or feature I want to build.

First, ask me what task, feature, or bug I am working on. 

Then, ask me clarifying questions one by one to resolve design branches, edge cases, and hidden dependencies. 
- Do not ask me more than one question at a time.
- Wait for my answer before asking the next question.
- If I explicitly mention this is a "small task" or request a quick turnaround, limit yourself to a maximum of 3 questions total.

After each of my answers, briefly acknowledge the technical decision made, and present the next logical question.

Finally, once all ambiguities are cleared, summarize our decisions and output a finalized, actionable Markdown step-by-step plan. Ensure this plan is formatted cleanly so it can be saved directly to `.pi/plans/` and ingested by `pi-openplan`.

Let's begin.
