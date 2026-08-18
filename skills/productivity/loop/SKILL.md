---
name: loop
description: Run /loop <task> as a subagent-driven, test-driven code-change loop with a user checkpoint and developer, tester, and three-pass reviewer gates.
---

# Loop Engineering

Invoke this skill with `/loop <task>`. Treat everything after `/loop` as the task, including multiline instructions. Preserve it verbatim when delegating; do not silently shorten, reinterpret, or split requirements.

You are the orchestrator. Do not implement the change yourself. Spawn subagents for the roles below, using isolated worktrees or equivalent isolation when the harness supports it. Pass every agent the original task, repository context, current branch/diff, prior reports, and the exact acceptance criteria.

## Roles

- **tester** — inspects the existing tests, establishes the baseline, writes feature tests, runs tests, and reports exact commands and failures. It does not implement production fixes.
- **developer** — implements the requested code change. Before handing off, it must run the relevant tests, lint, build/type checks, and available security/vulnerability checks, and fix failures it finds. It reports commands and results.
- **reviewer** — independently reviews the resulting diff for correctness, scope, regressions, maintainability, test quality, and security. It reports findings and does not make code changes.

## Parallelism

Keep stage dependencies sequential, but run independent work concurrently whenever it is safe:

- Use the harness' parallel fan-out (`runs.all`) for independent agents or review passes.
- Run the three review passes in parallel against the same verified diff; they are read-only and must each be independent.
- Within a quality or verification stage, run independent checks in parallel when they do not share mutable state; otherwise run them sequentially.
- Never run two writers against the same worktree. Keep developer changes serialized, and wait for all parallel checks/reviews before deciding the next stage.
- Include each parallel result in the stage summary and treat any failure as blocking.

## Workflow

Run these stages in order. After each stage, emit a concise summary with the agent, action, commands, and result.

1. **Baseline (tester)**
   - Run the existing relevant test suite before changing code.
   - If baseline tests fail, hand the failure to **developer** to fix the test or underlying issue, then return to **tester** to run the baseline again.
   - Do not write feature tests until the baseline is passing.
2. **User checkpoint (orchestrator, mandatory)**
   - Once the baseline is passing, create a concise change summary and an explicit implementation task describing what will be changed, files or areas likely affected, acceptance criteria, and the next test-driven steps.
   - Include a Markdown task checklist (`- [ ]`) covering every planned execution task, with the completed baseline marked `- [x]`. This checklist is the execution tracker: cross out each item by changing it to `- [x]` only after that task is actually complete, and add any newly discovered required task before continuing.
   - Present the summary, task, and checklist to the user, then stop. Do not write feature tests, modify production code, or spawn further stages during this turn.
   - Wait for the user to manually review the checkpoint. Resume execution only when the user gives `/loopx` (including any feedback supplied with it); otherwise remain paused.
   - On `/loopx`, incorporate the user's feedback into the task, preserve the original requirements, and continue at **Red**.
3. **Red (tester)**
   - Write the smallest tests that express the requested behavior.
   - Run them and confirm the new test fails for the expected reason.
   - Hand the failing test and failure output to **developer**.
4. **Green and quality gates (developer)**
   - Implement the minimum change that satisfies the task and tests.
   - Run relevant tests, lint, build/type checks, and available dependency/security vulnerability checks.
   - Fix all failures and security findings before handing back to **tester**.
5. **Verification (tester)**
   - Run the feature and regression tests.
   - If anything fails, hand the exact failure to **developer** and return to stage 4.
   - If all tests pass, hand the diff to **reviewer**.
6. **Review (reviewer, exactly 3 iterations)**
   - Fan out the three independent review passes in parallel with `runs.all`. Each pass must inspect the current diff and report either findings or `clean`.
   - If any pass requests a code change, stop the review cycle, hand the findings to **developer**, and restart at stage 4. After the fix is verified, restart all three review iterations; only three clean passes complete the workflow.
   - Do not skip, combine, or count a review pass performed on an outdated diff.

A handoff must include: current status, the current task checklist with completed items crossed out as `- [x]`, files changed, commands run, output or failure summary, remaining concerns, and the next required stage. Keep these summaries concise.

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
