---
name: groom-notes
description: Groom the knowledge vault by organizing files, standardizing tags, and building bidirectional links.
---

# Skill: Vault Grooming & Interconnection Guide

This skill guides the agent to systematically groom a knowledge vault. When activated, the agent must inspect the vault, enforce clean file structures, create meaningful bidirectional links, and standardize metadata/tagging conventions.

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
*   *Rule*: Ignore markdown files in the root directory during grooming; these are considered work-in-progress (WIP). Only move files from root if explicitly requested.

### 2. Bidirectional Link Generation
*   Actively scan for keywords related to other notes in the vault and wrap them in `[[Wiki-links]]`.
    *   *Example keywords to link*: `ArgoCD`, `GitOps`, `Platform Engineering`, `CI/CD`, `MyST`, `Sphinx`, `UV`, `Zettelkasten`, `Bullet Journal`.
*   When adding links, use aliases if it makes the sentence flow better: e.g. `[[What is GitOps|GitOps]]` instead of raw file names.
*   **Always make it bidirectional**: If Note A links to Note B, make sure Note B has a corresponding context link back to Note A, or a "Related" section at the bottom.
*   **Handle Broken Links**: If a note contains a link to a file that does not exist, create an empty file with the missing filename in the root directory and add `todo: create content` to its frontmatter.

### 4. Redundant Titles
*   **Remove H1 Titles matching Filename**: If a note contains an `# H1` title that is identical (or nearly identical) to its filename, remove the H1 from the document body to avoid redundancy, as the filename serves as the title.
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

When `/skill:groom-notes` or `/groom` is executed, perform the following steps:

1.  **Ignore Root Files**: Skip any markdown files in the root folder (treating them as WIP) unless specifically asked to process them.
2.  **Identify Broken Links**: Scan for `[[Wiki-links]]` that point to non-existent files. For each broken link, create an empty `.md` file in the root with `todo: create content` in the frontmatter.
3.  **Scan for Disconnected Notes**: Search the vault (excluding root WIP files) for markdown files containing low link-density and propose highly contextual cross-links.
3.  **Validate YAML Frontmatter**: Scan `.md` files for frontmatter containing `- "#tag"` syntax and convert them to clean `- tag` formats.
4.  **Remove Redundant Titles**: Scan for `# H1` headers that match the filename and propose their removal.
5.  **Confirm & Execute**: Propose the edits clearly, then modify the files precisely using your editing tools.
