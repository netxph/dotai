---
name: review
description: Reviews the current branch against origin/main, including committed, staged, unstaged, and untracked changes. First summarizes related changes at a high level, then reports actionable code-review findings. Use for /review or requests to review the current branch.
---

# Review

Review the repository opened by the user, using the current workspace/directory—not this skill's installation directory. Do not derive the repository from the skill file path. Start by inspecting the current workspace with `pwd` and `git rev-parse --show-toplevel`; run every subsequent Git command from that same current directory. If the current directory is not inside a Git repository, report that and stop. Do not `cd` to a fixed path.

Review the current branch using local Git state only. Do not modify files.

**Local-only rule:** never fetch, pull, push, contact a remote, refresh refs, or try to get the latest changes. Use the locally available `origin/main` ref exactly as it is. If that ref is missing or stale, report that and stop rather than updating it.

## Establish the review range

Run these commands before inspecting the diff. Do not assume the branch is named `feature`:

```bash
branch=$(git branch --show-current)
test -n "$branch" || { echo "Detached HEAD; cannot determine the current branch"; exit 1; }
test -e "$(git rev-parse --git-path refs/remotes/origin/main)" || git rev-parse --verify origin/main >/dev/null || {
  echo "origin/main is unavailable; fetch it or provide the base branch"; exit 1;
}
base=$(git merge-base origin/main "$branch")

# Required commit history: current branch name replaces `feature`.
git log "$base..$branch" --oneline --decorate --stat
```

Use the same resolved `base` and `branch` for every later command. Do not fetch, reset, stash, checkout, or otherwise change repository state.

The review input is the union of:

1. Commits in `"$base..$branch"`:
   ```bash
   git diff --no-ext-diff --find-renames "$base..$branch"
   ```
2. Staged changes:
   ```bash
   git diff --cached --no-ext-diff --find-renames
   ```
3. Unstaged tracked changes:
   ```bash
   git diff --no-ext-diff --find-renames
   ```
4. Untracked files. Find them with:
   ```bash
   git ls-files --others --exclude-standard
   ```
   Read each relevant untracked file directly and include it in the review. Do not silently omit it just because `git diff` does not show it.

Use `git status --short` and diff/stat commands to distinguish committed, staged, unstaged, deleted, renamed, and untracked changes. If the branch has no commits beyond `origin/main`, say so and review the working-tree changes only. If there are no changes at all, report that clearly and stop.

## Understand before judging

Inspect the changed code in context, including callers, related types, tests, configuration, and error-handling paths when needed. Check the commit history for intent when it clarifies behavior. Do not report style preferences, speculative improvements, or issues outside the changed behavior unless the change makes them relevant.

Look especially for:

- incorrect behavior, broken edge cases, and regressions
- security or authorization mistakes
- data loss, state corruption, and unsafe migrations
- error handling that hides failures or produces the wrong result
- concurrency, lifecycle, resource, and compatibility problems
- missing tests only when the changed behavior has a meaningful untested failure mode

A finding must be actionable and supported by the diff/context. For each finding, identify the precise file and line(s) in the new or working-tree code and explain the concrete failure scenario. Rank findings by severity:

- **P0**: blocks release or causes catastrophic impact
- **P1**: high-impact bug that should be fixed before merge
- **P2**: normal bug worth fixing
- **P3**: low-impact issue or robustness gap

If there are no findings, say so explicitly. Do not invent findings to fill the report.

## Required response order

The response must begin with a high-level summary of what changed, before any issue is named. Group related files/commits into a few coherent change areas rather than listing every commit separately. Mention whether the summary covers committed changes, working-tree changes, or both.

Use this format:

```markdown
## Summary

- **Area:** what changed and why, grouped with related changes.
- **Area:** ...
- **Review scope:** `origin/main` merge-base → current branch, plus staged/unstaged/untracked changes (or state which categories were empty).

## Findings

### [P1] Short issue title — `path/to/file.ext:line`

Explain the concrete failure scenario, why the changed code causes it, and the smallest useful fix direction.

## Tests

- Tests/checks run, or `Not run (review only)`.
```

Keep findings ordered from most severe to least severe. If none exist, use:

```markdown
## Findings

No actionable issues found in the reviewed changes.
```

Never put findings before `## Summary`.
