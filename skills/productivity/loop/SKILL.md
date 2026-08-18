---
name: loop
description: Run /loop <task> as a subagent-driven, test-driven code-change loop with developer, tester, and three-pass reviewer gates.
---

# Loop Engineering

Invoke this skill with `/loop <task>`. Treat everything after `/loop` as the task, including multiline instructions. Preserve it verbatim when delegating; do not silently shorten, reinterpret, or split requirements.

You are the orchestrator. Do not implement the change yourself. Spawn subagents for the roles below, using isolated worktrees or equivalent isolation when the harness supports it. Pass every agent the original task, repository context, current branch/diff, prior reports, and the exact acceptance criteria.

## Roles

- **tester** — inspects the existing tests, establishes the baseline, writes feature tests, runs tests, and reports exact commands and failures. It does not implement production fixes.
- **developer** — implements the requested code change. Before handing off, it must run the relevant tests, lint, build/type checks, and available security/vulnerability checks, and fix failures it finds. It reports commands and results.
- **reviewer** — independently reviews the resulting diff for correctness, scope, regressions, maintainability, test quality, and security. It reports findings and does not make code changes.

## Workflow

Run these stages in order. After each stage, emit a concise summary with the agent, action, commands, and result.

1. **Baseline (tester)**
   - Run the existing relevant test suite before changing code.
   - If baseline tests fail, hand the failure to **developer** to fix the test or underlying issue, then return to **tester** to run the baseline again.
   - Do not write feature tests until the baseline is passing.
2. **Red (tester)**
   - Write the smallest tests that express the requested behavior.
   - Run them and confirm the new test fails for the expected reason.
   - Hand the failing test and failure output to **developer**.
3. **Green and quality gates (developer)**
   - Implement the minimum change that satisfies the task and tests.
   - Run relevant tests, lint, build/type checks, and available dependency/security vulnerability checks.
   - Fix all failures and security findings before handing back to **tester**.
4. **Verification (tester)**
   - Run the feature and regression tests.
   - If anything fails, hand the exact failure to **developer** and return to stage 3.
   - If all tests pass, hand the diff to **reviewer**.
5. **Review (reviewer, exactly 3 iterations)**
   - Perform three independent review passes. Each pass must inspect the current diff and report either findings or `clean`.
   - If any pass requests a code change, stop the review cycle, hand the findings to **developer**, and restart at stage 3. After the fix is verified, restart all three review iterations; only three clean passes complete the workflow.
   - Do not skip, combine, or count a review pass performed on an outdated diff.

A handoff must include: current status, files changed, commands run, output or failure summary, remaining concerns, and the next required stage. Keep these summaries concise.

## Hard stops

Track attempts per distinct issue (test failure, build/lint failure, security finding, or review finding). A retry means a concrete developer/tester action followed by the relevant check. After the third unsuccessful attempt for the same issue:

- stop all subagents and make no further changes;
- report the issue, three attempted fixes/checks, affected files, and the exact error output in a concise hard-stop summary;
- return control to the human and wait for manual resolution or instructions;
- when instructed to continue, resume from the failed stage with the attempt counter explicitly reset or retained as the human specifies.

Never bypass a failed check, waive a security finding, or declare success because a later check passed. If the harness cannot run a required check, report it as unavailable and ask whether to continue rather than pretending it passed.

## Completion

End with a concise summary of:

- files changed;
- tests, lint, build, and security checks that passed;
- the three clean review iterations;
- any intentionally skipped checks and why.

Do not add unrelated refactors, speculative abstractions, or extra dependencies.
