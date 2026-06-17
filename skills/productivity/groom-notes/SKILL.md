---
name: groom-notes
description: Groom the knowledge vault by organizing files, standardizing tags, and building bidirectional links.
---

# Skill: Vault Grooming & Interconnection Guide

This skill guides the agent to systematically groom a knowledge vault. When activated, the agent must inspect notes, enforce clean file structures, create meaningful bidirectional links, and standardize metadata/tagging conventions.

When running grooming analysis, present a structured plan with Phase 1, Phase 2, and Phase 3 before execution.

If the resolved scope includes any files under `Atlas/`, include a dedicated phase to create/update/fix Atlas Maps of Content (MOCs). If no `Atlas/` files are in scope, skip that phase.

---

## 🎯 Scope Rules (Required)

`/skill:groom-notes` and `/groom` support an **optional folder parameter**:

- **With parameter** (example: `/groom Effort/Work`): groom **only** files inside that folder subtree.
- **Without parameter**: groom **only** files/folders prefixed with `_WIP`.

Scope behavior is strict:

1. Apply grooming actions (organization, metadata cleanup, title cleanup, link enrichment) **only within the scoped set**.
2. If a scoped note links to an out-of-scope note (or vice versa), you may update links in **both notes only as needed to fix/complete the relationship** (e.g., repair broken wiki-link target, add required backlink context).
3. Do **not** perform unrelated grooming on out-of-scope notes.

---

## 📋 The Grooming Standard

Every time you are asked to groom this vault (or a scoped folder), enforce the following rules.

### 1. File Organization (ACE Framework)
Ensure files live in their correct domains:
- **Atlas (`Atlas/`)**: Maps of Content (MOCs), conceptual frameworks, cheat sheets, recipes, static configurations.
  - Subfolders: `Atlas/Software Documentation/`, `Atlas/Technologies/`, `Atlas/Knowledge Management/`, `Atlas/Interests/`.
- **Calendar (`Calendar/`)**: Chronological logs (Daily/Weekly notes). Format: `Calendar/YYYY-MM-DD.md`.
- **Effort (`Effort/`)**: Projects, active studies, and short-term work.
  - Subfolders: `Effort/Ideas/`, `Effort/Learning AI/`, `Effort/Platform Engineering/`, `Effort/Work/`.

> Apply organization decisions only to in-scope files.

### 2. Bidirectional Link Generation
- Scan for keywords related to other notes and wrap them in `[[Wiki-links]]`.
  - Example keywords: `ArgoCD`, `GitOps`, `Platform Engineering`, `CI/CD`, `MyST`, `Sphinx`, `UV`, `Zettelkasten`, `Bullet Journal`.
- Use aliases where sentence flow is better, e.g. `[[What is GitOps|GitOps]]`.
- Keep links bidirectional: if Note A links to Note B, ensure B has contextual link-back or a Related section entry.
- **Handle broken links**: if a wiki-link points to a missing file, create an empty file with that filename and add frontmatter:
  ```yaml
  ---
  todo: create content
  ---
  ```

> Cross-scope linking exception: when link fixes require touching an out-of-scope note, limit edits to link/backlink fixes only.

### 3. Redundant Titles
- Remove H1 titles that duplicate (or nearly duplicate) the filename.

### 4. Frontmatter and Tag Hygiene
- No `#` in YAML tags.
  - Bad: `- "#cicd"`
  - Good: `- cicd`
- Prefer nested tags when useful:
  - `tech/python`, `tech/gitops`, `pkm/zettelkasten`, `work/management`, `ideas/coffee`.
- Standard shape:
  ```yaml
  ---
  version: "1.0"
  tags:
    - gitops
    - platform-engineering
  ---
  ```
- If frontmatter/properties are missing, add them.
  - Start by generating `tags` from note content/keywords (auto-generated tags).
  - Then add other standard properties (e.g., `version`) using safe defaults.

### 5. Atlas MOC Maintenance (Conditional)
- Apply this rule **only when the resolved scope includes `Atlas/` files**.
- For Atlas notes in-scope, create/update/fix Maps of Content (MOCs):
  - ensure major topics have an MOC note,
  - ensure MOCs contain curated links to relevant Atlas/Effort/Calendar notes as applicable,
  - repair stale/broken MOC links,
  - add brief context under each MOC link where helpful.
- Do not perform unrelated MOC grooming for out-of-scope Atlas areas.

### 6. Markdown Formatting & Reference Footer
- Normalize markdown formatting in-scope:
  - consistent heading spacing,
  - clean bullet/numbered list formatting,
  - proper fenced code block markers,
  - remove obvious trailing noise/formatting artifacts.
- If a note contains inline references/wiki-links to other notes, append a footer section:
  - `## References`
  - Summarize linked notes as bullets with short context.

---

## 🛠️ Step-by-Step Grooming Workflow

When `/skill:groom-notes` or `/groom` is executed:

1. **Resolve Scope**
   - If folder arg is provided, set scope to that subtree.
   - If no arg is provided, scope to files/folders prefixed with `_WIP` only.
2. **Inventory In-Scope Notes**
   - Enumerate only in-scope markdown files for grooming candidates.
3. **Identify and Fix Broken Links**
   - Prioritize broken wiki-links originating in scope.
   - Create missing files when needed.
   - If link repair needs out-of-scope note edits, apply link-only changes there.
4. **Scan for Disconnected Notes**
   - Find low link-density in-scope notes and propose contextual cross-links.
5. **Validate YAML Frontmatter**
   - Fix tag syntax and normalize in-scope frontmatter.
   - Add missing properties/frontmatter, starting with auto-generated tags.
6. **Create/Update/Fix Atlas MOCs (Conditional)**
   - Run this step only if the resolved scope includes files under `Atlas/`.
   - Create missing MOCs, update weak/outdated MOCs, and fix broken links in Atlas MOCs.
   - Skip entirely when no `Atlas/` files are in scope.
7. **Fix Markdown Formatting**
   - Normalize heading/list/code-fence formatting in-scope.
8. **Add References Footer**
   - If in-note links/references exist, append `## References` with concise link summaries.
9. **Remove Redundant Titles**
   - Remove filename-duplicate H1 headings in-scope.
10. **Confirm & Execute**
   - Propose edits clearly, then apply precise edits.
   - Keep any out-of-scope edits strictly limited to required link integrity updates.
