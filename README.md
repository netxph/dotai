# dot.ai 🤖

Personal [Pi](https://github.com/earendil-works/pi-coding-agent) package with productivity skills and an ephemeral `/toggle` picker.

## Install

```bash
pi install .
```

Or from GitHub:

```bash
pi install git:github.com/netxph/dotai
```

## What's In This Repo

- `skills/productivity/grilling` — grills plans, decisions, and ideas.
- `skills/productivity/loop` — runs TDD code-change loops with tester, developer, and reviewer subagents.
- `skills/productivity/research` — researches topics and produces long-form, source-backed writing.
- `extensions/toggle.ts` — enables or disables global skills and prompt templates for the current Pi process.

## Use `/toggle`

Each new Pi process starts with global skills and prompt templates disabled. Project-local resources are unchanged.

1. Type `/toggle`.
2. Search or use ↑/↓ to navigate resources and first-folder groups.
3. Press Space to toggle one resource or every resource in a selected folder.
4. Use `Alt+A` to select all or `Alt+N` to select none, regardless of search.
5. Press Escape to apply the selection and reload Pi.

Folders with multiple children show `[x]` when all are selected, `[-]` when partially selected, and `[ ]` when empty. Single-child folders are flattened to one resource row. The selection survives `/reload` in the current process but resets when Pi restarts. `/toggle` itself cannot be disabled.

## Verify

```bash
npm test
pi -e ./extensions/toggle.ts
```

## Using Outside Pi

Copy the relevant `skills/productivity/*/SKILL.md` into another harness if you want the same behavior.

## License

MIT
