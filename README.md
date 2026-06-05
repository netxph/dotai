# dot.ai 🤖

A collection of personal AI customizations, skills, prompts, and packages for the [pi](https://github.com/earendil-works/pi-coding-agent) coding agent.

## 📁 Repository Structure

- `skills/`: Custom tool definitions and executable skills.
  - `productivity/grill-me`: Interview prep and knowledge checking.
  - `education/teach-mode`: Pedagogical mode for learning without direct execution.
- `prompts/`: System instructions and personas.
  - `AGENTS.md`: Global instructions (Windows, PowerShell, Caveman mode).
- `packages/`: Reusable logic and integrations.

## 🚀 Supported Agent

This repository is optimized for **Pi**: The coding agent harness and TUI.

## 🛠️ Usage

The easiest way to use this collection is to install it as a Pi package.

```bash
# Install directly from GitHub
pi install git:github.com/netxph/dotai

# Or install locally from a cloned directory
pi install .
```

Once installed, the skills and prompts are automatically integrated:

- **Skills**: `/skill:grill-me` and `/skill:teach-mode` are ready to use.
- **Prompts**: `AGENTS.md` is available as a prompt template. Note: To use it as global *instructions*, you may still want to symlink it or reference it in your `instructions` setting.

## 🤖 Other Agents

While this repository is packaged for Pi, you can manually use these customizations in other agents (Cursor, Windsurf, Cline, Aider, etc.):

### Using Skills
Copy the content of the `SKILL.md` file from the desired skill directory and paste it into your agent's system prompt or a project-specific rules file (e.g., `.cursorrules`, `.windsurfrules`).

### Using Global Instructions
To use the Windows/PowerShell/Caveman persona:
1. Open `prompts/AGENTS.md`.
2. Copy the relevant sections.
3. Paste them into your agent's "Custom Instructions" or "System Prompt" settings.

---

## 📝 License

MIT
