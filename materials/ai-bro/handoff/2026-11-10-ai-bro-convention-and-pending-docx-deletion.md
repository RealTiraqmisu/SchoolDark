# Handoff 2: SchoolDark — ai-bro convention set, docx deletion pending

Handed off from: opencode (GLM flash) session, 2026-11-10 (second handoff, same day)
Next agent: Claude (analysis-type tasks planned)
Companion doc: `materials/ai-bro/handoff/2026-11-10-docx-to-md-ssot.md` (handoff 1 — session 1 details: docx→MD conversion, converter quirks, SSOT setup). Read both; this one covers the delta and current standing rules.

## Standing repo conventions (user-defined, enforce these)

- **`materials/ai-bro/`** = neutral AI-owned folder, belongs to no single tool. Contains: `CONTEXT.md` (Team B ERD vocabulary, moved from `materials/doc/CONTEXT.md` — old path dead), `handoff/` (all handoffs live here; older: `HANDOFF-school-dark-2026-11-08.md`, newer: `2026-11-10-docx-to-md-ssot.md`), `tools/convert_docx_to_md.py` (moved from repo-root `tools/` — that path is dead).
- **Rule: anything AI-related → `materials/ai-bro/`**. Content/subject-matter files → `materials/doc/` (e.g. `final-report.md`, `images/`). Never park handoffs only in tool-specific dirs (`.claude/`, `.opencode/`, OS temp) — they get wiped and lost.
- Handoff naming: `YYYY-MM-DD-topic.md` in `materials/ai-bro/handoff/`.

## Current state (delta since handoff 1)

- `final-report.md` regenerated from the new script location — verified working (`python materials/ai-bro/tools/convert_docx_to_md.py "materials/doc/project1 documentation รายงานฉบับขอสอบ (Final report).docx" "materials/doc/final-report.md"`). Its header comment now points at the new script path. 84 images intact.
- User asked whether it's safe to delete the source docx; I answered (see Pending) and they haven't deleted it yet as of handoff time.
- Everything from handoff 1 still true: no commits this session, `AGENTS.md` at root still not created (ask before creating).

## Pending decisions

1. **Source docx deletion** — `materials/doc/project1 documentation รายงานฉบับขอสอบ (Final report).docx` is **untracked in git** (`??`); deleting = permanent loss, no history to recover. Content-wise nothing depends on it (`.md` + images are self-contained); only regeneration does. Options given to user: (a) they have a copy elsewhere → delete freely, (b) commit it once then remove from working tree (recommended), (c) keep as-is. Confirm which they chose before assuming the file exists.
2. `AGENTS.md` pointer at repo root — still on offer, not confirmed.
3. The analysis work itself — scope undefined; start from `final-report.md` + `materials/ai-bro/CONTEXT.md`.

## Suggested skills for the next agent

- `codebase-design` / `improve-codebase-architecture` — if analysis is architecture-level (likely: two-backend split).
- `domain-modeling` — if touching ERD/terminology; extends `materials/ai-bro/CONTEXT.md`.
- `code-review` — if reviewing changes against the spec in `final-report.md`.
- `handoff` — end of YOUR session: write to OS temp per the skill, then copy to `materials/ai-bro/handoff/` per the user's rule (that copy is the one that survives).
