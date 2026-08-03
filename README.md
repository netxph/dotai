# dot.ai 🤖

Personal Pi package with opinionated skills, prompts, and extension setup for daily coding-agent work.

## 🚀 Supported Agent

Optimized for **[Pi](https://github.com/earendil-works/pi-coding-agent)**.

## 📦 Install This Package

```bash
# from GitHub
pi install git:github.com/netxph/dotai

# or from local clone
pi install .
```

## 🔧 Install Extensions + Executables (recommended)

After installing this package, run the helper script to install all external dependencies used by this setup.

```bash
# macOS/Linux
./scripts/install-extensions.sh

# Windows PowerShell
./scripts/install-extensions.ps1
```

Requirements: `pi`, `npm` in `PATH`.

### What the install script sets up

#### Pi extensions/packages
- `npm:pi-openplan`
- `npm:pi-lmstudio`
- `npm:pi-web-access`
- `npm:pi-agent-browser-native`
- `git:github.com/DietrichGebert/ponytail`

#### Executables / CLIs
- `agent-browser` (installed via `npm install -g agent-browser` if missing)

## 🧩 What’s In This Repo

### Local extension
- `extensions/uv-global.ts`
  - Enforces a uv-first Python workflow in Pi sessions.
  - Rewrites bash calls to prefer:
    - `uv run python ...`
    - `uv pip ...`

### Local skills
- `skills/productivity/grill-me`
  - Trigger ideas: `grill`, stress-test-plan requests.
- `skills/productivity/caveman`
  - `/skill:caveman` to activate, `/skill:caveman off` to exit.
- `skills/productivity/handoff`
  - Generates compact handoff summary for a new agent session.
- `skills/productivity/groom-notes`
  - Vault grooming workflow. Trigger: `/skill:groom-notes` or `/groom`.
- `skills/productivity/quick-plan`
  - Lightweight planning mode. `/qp` to plan, `/qpx` to execute.
- `skills/education/teach-mode`
  - Explain-only mode (no edits). Exit with `Switch to Action Mode`.

### Prompts
- `prompts/bootstrap.md`
  - Base behavior and response style constraints.

## 🧪 Quick Verification

```bash
# package installed
pi list

# required CLIs available
agent-browser --version

# optional: agent-browser wrapper health check
npm exec --yes --package pi-agent-browser-native@latest -- pi-agent-browser-doctor
```

## 🤖 Using Outside Pi

You can still reuse these assets in other agents:
- copy a skill’s `SKILL.md` into that agent’s rules/system prompt
- copy `prompts/bootstrap.md` into custom instructions

---

## 📝 License

MIT
