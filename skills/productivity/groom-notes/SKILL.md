---
name: groom-notes
description: Run vault grooming routines ONLY when explicitly requested via '/groom', '/skill:groom-notes', or direct instructions to groom/clean up the vault.
---

# Skill: Vault Grooming & Interconnection Guide

This skill guides the agent to systematically groom a knowledge vault. When activated, the agent must inspect notes, enforce clean file structures, create meaningful bidirectional links, and standardize metadata/tagging conventions.

When running grooming analysis, present a structured plan with Phase 1, Phase 2, and Phase 3 before execution.

---

## 🎯 Scope Rules (Required)

`/skill:groom-notes` and `/groom` support an **optional folder parameter**:

- **With parameter** (example: `/groom Effort/Work`): groom **only** files inside that folder subtree.
- **Without parameter**: groom markdown files updated anywhere in the vault within the last **10 days**.

Scope behavior is strict:

- **Never groom any file or folder prefixed with `_WIP`** unless the user explicitly names it (e.g., `/groom _WIP/someproject`). Exclude all `_WIP`-prefixed items from scope even if they appear inside a groomed subtree, and also exclude anything nested under any `_WIP*` directory during vault-wide grooming.
- **Default recency filter:** unless the user explicitly asks for a **full scan**, **all files**, or equivalent wording, only process markdown files updated within the last **10 days**.
- **Use Git to determine recency/scope by default**: prefer Git history and working-tree state (for example, recent paths from `git log --since='10 days ago' --name-only` plus current changed files from `git diff --name-only`) instead of filesystem modified timestamps.
- If the filtered set is empty, report that no recently changed notes were found and ask whether to run a full scan instead.

1. Apply grooming actions (organization, metadata cleanup, title cleanup, link enrichment) **only within the scoped set after the default 10-day recency filter is applied**.
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
  up: "[[000 <folder name>]]"
  tags:
    - gitops
    - platform-engineering
  ---
  ```
- `up` must point to the corresponding folder MOC using the folder name:
  - Example: notes under `Atlas/Technologies/` use `up: "[[000 Technologies]]"`.
- If frontmatter/properties are missing, add them.
  - Start by generating `tags` from note content/keywords (auto-generated tags).
  - Then add other standard properties (e.g., `version`, `up`) using safe defaults.

### 5. MOC Maintenance
- For every folder that has in-scope files, create/update/fix its Map of Content (MOC):
  - ensure each folder has an MOC note,
  - use this MOC naming convention: `000 <folder name>.md`,
  - ensure notes in that folder set `up` to the matching MOC (`[[000 <folder name>]]`),
  - ensure MOCs contain curated links to relevant notes as applicable,
  - repair stale/broken MOC links,
  - add brief context under each MOC link where helpful.

### 6. Markdown Formatting & Reference Footer
- Normalize markdown formatting in-scope:
  - consistent heading spacing,
  - clean bullet/numbered list formatting,
  - proper fenced code block markers,
  - remove obvious trailing noise/formatting artifacts.
- If a note contains inline references/wiki-links to other notes, append a footer section:
  - `## References`
  - Summarize linked notes as bullets with short context.
  - **Exclude MOC files from this section** (e.g., notes named `000 <folder name>` or other Maps of Content).

---

## 🛠️ Step-by-Step Grooming Workflow

When `/skill:groom-notes` or `/groom` is executed:

1. **Resolve Scope**
   - If folder arg is provided, set scope to that subtree.
   - If no arg is provided, set scope to the whole vault, then limit candidates to markdown files updated within the last **10 days**.
   - Unless the user explicitly requests a **full scan**, apply the default **10-day** recency filter using **Git-based file discovery** rather than filesystem modified timestamps.
   - Always exclude `_WIP*` files/folders unless the user explicitly names that `_WIP*` path.
2. **Inventory In-Scope Notes**
   - Enumerate only in-scope markdown files for grooming candidates.
   - By default, inventory only files changed in the last 10 days according to Git history / working-tree state; include older files only when the user explicitly asks for a full scan.
3. **Identify and Fix Broken Links**
   - Prioritize broken wiki-links originating in scope.
   - Create missing files when needed.
   - If link repair needs out-of-scope note edits, apply link-only changes there.
4. **Scan for Disconnected Notes**
   - Find low link-density in-scope notes and propose contextual cross-links.
5. **Validate YAML Frontmatter**
   - Fix tag syntax and normalize in-scope frontmatter.
   - Add missing properties/frontmatter, starting with auto-generated tags.
   - Ensure `up` links each note to its folder MOC (`[[000 <folder name>]]`).
6. **Create/Update/Fix MOCs**
   - For every folder containing in-scope files, create missing MOCs, update weak/outdated MOCs, and fix broken MOC links.
   - Use the naming convention `000 <folder name>.md` for MOCs.
   - Ensure each in-scope note links to its folder MOC via `up`.
7. **Fix Markdown Formatting**
   - Normalize heading/list/code-fence formatting in-scope.
8. **Add References Footer**
   - If in-note links/references exist, append `## References` with concise link summaries.
   - Do not include MOC files in `## References` entries.
9. **Remove Redundant Titles**
   - Remove filename-duplicate H1 headings in-scope.
10. **Confirm & Execute**
   - Propose edits clearly, then apply precise edits.
   - Keep any out-of-scope edits strictly limited to required link integrity updates.
