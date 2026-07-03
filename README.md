# dot.ai 🤖

A collection of personal AI customizations, skills, prompts, and packages for the [pi](https://github.com/earendil-works/pi-coding-agent) coding agent.

## 📁 Repository Structure

- `skills/`: Custom tool definitions and executable skills.
  - `productivity/grill-me`: **Knowledge Auditor.** Forces the agent to interview you on a specific topic. Asks one question at a time, evaluates answers, and provides a final score.
  - `productivity/caveman`: **Minimalist Persona.** Strips away grammar, articles, and politeness to minimize token usage and maximize response speed. Use `/skill:caveman` to activate.
  - `productivity/handoff`: **Agent Transition.** Generates a dense, technical summary of the current goal, progress, and state to allow a fresh AI session to resume work immediately.
  - `education/teach-mode`: **Pedagogical Guide.** Prevents the agent from making direct changes. Instead, it explains the "why" and provides step-by-step guidance using a structured Todo/Proposed/Alternatives format.
- `prompts/`: System instructions and personas.
  - `bootstrap.md`: **Core Behavioral Logic.** Defines the Windows/PowerShell environment and enforces global brevity. It ensures all responses use bullets and fragments rather than long paragraphs, regardless of the active skill.
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

- **Skills**: 
  - `/skill:grill-me`: Start a knowledge check session.
  - `/skill:teach-mode`: Enter learning mode (explanations only).
  - `/skill:caveman`: Enter token-saving minimalist mode.
  - `/skill:handoff`: Generate a summary for the next agent.
- **Global Instructions**: `bootstrap.md` is the source of truth for the agent's environment and style. It configures the agent for Windows usage and enforces a strict "no-paragraphs" rule to keep interactions fast and focused.
- **Special Toggles**:
  - **Teach Mode**: Exit with `Switch to Action Mode` or `/skills:teach-mode off`.
  - **Caveman Mode**: Exit with `Exit Caveman Mode` or `/skill:caveman off`.

## 🤖 Other Agents

While this repository is packaged for Pi, you can manually use these customizations in other agents (Cursor, Windsurf, Cline, Aider, etc.):

### Using Skills
Copy the content of the `SKILL.md` file from the desired skill directory and paste it into your agent's system prompt or a project-specific rules file (e.g., `.cursorrules`, `.windsurfrules`).

### Using Global Instructions
To use the Windows/PowerShell/Brevity persona:
1. Open `prompts/bootstrap.md`.
2. Copy the relevant sections.
3. Paste them into your agent's "Custom Instructions" or "System Prompt" settings.

---

## 📝 License

MIT
