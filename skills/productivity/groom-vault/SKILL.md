---
name: groom-vault
description: Groom the Nox knowledge vault by organizing files, standardizing tags, and building bidirectional links.
---

# Skill: Nox Vault Grooming & Interconnection Guide

This skill guides the agent to systematically groom the "Nox" knowledge vault. When activated, the agent must inspect the vault, enforce clean file structures, create meaningful bidirectional links, and standardize metadata/tagging conventions.

When running a vault-wide grooming analysis, please examine the files, identify clutter, validate frontmatter tags, find high-value bidirectional link opportunities, and present a structured plan to execute Phase 1, Phase 2, and Phase 3 of the Grooming Notes.

---

## 📋 The Grooming Standard

Every time you are asked to groom this vault (or any folder inside it), you must enforce the following rules:

### 1. File Organization (ACE Framework)
Ensure files live in their correct domains:
*   **Atlas (`Atlas/`)**: Maps of Content (MOCs), conceptual frameworks, cheat sheets, recipes, static configurations.
    *   *Subfolders*: `Atlas/Software Documentation/`, `Atlas/Technologies/`, `Atlas/Knowledge Management/`, `Atlas/Interests/`.
*   **Calendar (`Calendar/`)**: Chronological logs (Daily/Weekly notes). Format should be `Calendar/YYYY-MM-DD.md`.
*   **Effort (`Effort/`)**: Projects, active studies, and short-term work.
    *   *Subfolders*: `Effort/Ideas/`, `Effort/Learning AI/`, `Effort/Platform Engineering/`, `Effort/Work/`.
*   *Rule*: Keep the root directory minimal. Do not let loose notes sit in the root unless explicitly requested (e.g. `README.md`, `Grooming Notes.md`).

### 2. Bidirectional Link Generation
*   Actively scan for keywords related to other notes in the vault and wrap them in `[[Wiki-links]]`.
    *   *Example keywords to link*: `ArgoCD`, `GitOps`, `Platform Engineering`, `CI/CD`, `MyST`, `Sphinx`, `UV`, `Zettelkasten`, `Bullet Journal`.
*   When adding links, use aliases if it makes the sentence flow better: e.g. `[[What is GitOps|GitOps]]` instead of raw file names.
*   **Always make it bidirectional**: If Note A links to Note B, make sure Note B has a corresponding context link back to Note A, or a "Related" section at the bottom.

### 3. YAML Metadata & Tags
Ensure frontmatter conforms to clean standards:
*   **No `#` in YAML**: Tags in frontmatter should not contain hashes.
    *   *Bad:* `- "#cicd"`
    *   *Good:* `- cicd`
*   **Nested Tags**: Organize categories hierarchically where appropriate:
    *   `tech/python`, `tech/gitops`, `pkm/zettelkasten`, `work/management`, `ideas/coffee`.
*   **Standard Fields**:
    ```yaml
    ---
    version: "1.0"
    tags:
      - gitops
      - platform-engineering
    ---
    ```

---

## 🛠️ Step-by-Step Grooming Workflow

When `/skill:groom-vault` or `/groom` is executed, perform the following steps:

1.  **Scan for Root Clutter**: Identify any markdown files in the root folder (excluding `README.md` and `Grooming Notes.md`) and suggest moves to `Atlas/`, `Calendar/`, or `Effort/`.
2.  **Scan for Disconnected Notes**: Search the vault for markdown files containing low link-density and propose highly contextual cross-links.
3.  **Validate YAML Frontmatter**: Scan `.md` files for frontmatter containing `- "#tag"` syntax and convert them to clean `- tag` formats.
4.  **Confirm & Execute**: Propose the edits clearly, then modify the files precisely using your editing tools.
