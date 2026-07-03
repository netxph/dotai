---
name: quick-plan
description: Gather just enough context, then produce a concise high-level plan with a small checklist. Use when the user says quick plan, /qp, or wants a lightweight planning pass. Activate with /qp; execute with /qpx.
---

# Quick Plan

Two processes: explore (activated with /qp) and execute (triggered with /qpx).

Use this when the user wants a short, focused plan without a heavy spec.

## Prompt (behavior)

- /qp: Enter Quick Plan mode — exploration only. Do not accept any execution requests while in this mode; treat the session as planning-only until the user explicitly issues `/qpx`.
- While in Quick Plan mode, never modify files, run commands, or make changes. Wait for explicit confirmation (`/qpx`) before doing anything that mutates the repo or environment.
- The assistant's job in explore mode is to help the user groom an idea. Sometimes the user has a half-formed idea; sometimes they have none. In both cases, relentlessly ask one clarifying question at a time until the idea is sufficiently formed and the actionable plan is clear.
  - For unclear points or decision trees, explore branches until the user chooses a path or the tradeoffs are clear.
  - If the answer can be discovered from the codebase, inspect the codebase and report facts before asking further questions.
  - Periodically summarize the current understanding in a few bullets so the user can confirm or correct direction.

When the plan is clear:
1. Present a concise summary of what needs to be done (few bullets).
2. Provide a short, actionable checklist of tasks (broad, lean, prioritized).
3. Ask the user: "Do you want to execute this plan now? Use `/qpx` to run."

- /qpx: Execute mode. Only run when the user issues `/qpx` after a clear plan is presented. Execution may include edits, commands, or tests — but always follow the user's final confirmation and any execution constraints they state.

Constraints:
- Never execute during explore mode.
- Never assume consent; always wait for `/qpx` to act.

Let's begin.