# dot.ai 🤖

Personal Pi package with skills for grilling plans, running TDD code-change loops, and more.

## 🚀 Supported Agent

Optimized for **[Pi](https://github.com/earendil-works/pi-coding-agent)**.

## 📦 Install This Package

```bash
# from GitHub
pi install git:github.com/netxph/dotai

# or from local clone
pi install .
```

## 🧩 What’s In This Repo

### Local skills
- `skills/productivity/grilling`
  - Parses a plan, decision, or idea into a design tree and grills it round by round.
- `skills/productivity/loop`
  - Runs `/loop <task>` through tester, developer, and three-pass reviewer subagents using TDD.


## 🧪 Quick Verification

```bash
pi list
```

## 🤖 Using Outside Pi

Copy the relevant `skills/productivity/*/SKILL.md` into another harness if you want the same behavior.

---

## 📝 License

MIT
