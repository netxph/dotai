# dotai 🤖

A collection of personal AI customizations, skills, prompts, and packages to enhance daily development workflows across various coding agents.

## 📁 Repository Structure

- `skills/`: Custom tool definitions and executable skills for agents like [pi](https://github.com/earendil-works/pi-coding-agent).
- `prompts/`: System instructions, personas, and reusable prompt templates.
- `packages/`: Reusable logic and integrations packaged for agent environments.
- `configs/`: Configuration files for various AI-powered editors and tools.

## 🚀 Supported Agents

This repository aims to be agent-agnostic where possible, with specific optimizations for:
- **Pi**: Coding agent harness and TUI.
- **Cursor / Windsurf**: AI-native IDEs.
- **Cline / Roo Code**: VS Code extension agents.
- **Aider**: Terminal-based pair programming.

## 🛠️ Usage

### For Pi Users
To use skills from this repo in Pi, you can symlink them to your `.pi/skills` directory or reference them in your configuration.

```bash
# Example: Adding a skill
ln -s $(pwd)/skills/my-skill.js ~/.pi/skills/
```

### For Cursor/Windsurf
Rules and system prompts can be copied or linked to `.cursorrules` or `.windsurfrules` in your active projects.

## 📝 License

MIT
