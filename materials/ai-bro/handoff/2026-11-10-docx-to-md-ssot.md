# Handoff: SchoolDark — docx→MD SSOT conversion done, next: analysis work

Handed off from: opencode (GLM flash) session, 2026-11-10
Next agent: Claude (user plans analysis-type tasks)

## What this repo is

SchoolDark — school management system (master data + registration/admissions), senior project (KMITL IT, 1/2026). Single school, no multi-tenant. Two backends: `backend-a` (Team A, academic — FastAPI), `backend-b` (Team B, registration/admissions/HR/settings — FastAPI). Frontend in `uxui-merged/` (Next.js portals: admission, apply, parent, settings, shared, schooldark).

## User preferences

- Communicates in casual Thai. Be direct, concise.
- Wants a shared single-source-of-truth doc that ANY AI entering the folder reads — treat `materials/doc/final-report.md` as the SRS + project documentation.
- Likes being asked one clarifying question with a recommended option before big choices, then left to run.

## What was just completed (this session)

Converted the official final report docx to Markdown as the AI-facing SSOT:

- **Output**: `materials/doc/final-report.md` (~2,800 lines, 506KB) — full SRS/report: chapters 1–5, requirements (functional/non-functional), architecture (Service B: Next.js portal + FastAPI + PostgreSQL split schemas, IAM JWT via Service B private key), use case tables, ERD sections + data dictionary, AI-native SDLC section, appendices.
- **Images**: 84 files extracted to `materials/doc/images/`, all referenced by relative path (verified 0 missing).
- **Converter script** (re-runnable when docx updates): `materials/ai-bro/tools/convert_docx_to_md.py` (AI-owned tooling lives under `materials/ai-bro/`; generated content stays in `materials/doc/`)
  ```
  python materials/ai-bro/tools/convert_docx_to_md.py "materials/doc/project1 documentation รายงานฉบับขอสอบ (Final report).docx" "materials/doc/final-report.md"
  ```
  Requires `python-docx` + `Pillow` (installed). Handles: heading hierarchy, image extraction, GFM tables, bullet/numbered lists, skips Word TOC field and regenerates one. Known quirks fixed: soft line breaks in headings, adjacent bold-run merging (`**a****b**`), empty bullets, images inside heading paragraphs.

## Repo conventions (from user)

- **`materials/ai-bro/` is the neutral shared AI folder** — belongs to no single tool. Handoffs ALWAYS go here (`materials/ai-bro/handoff/`), never only inside a tool-specific dir (`.claude/`, `.opencode/`, …) — those get wiped/lost. There is an older handoff there: `HANDOFF-school-dark-2026-11-08.md`.
- `materials/ai-bro/CONTEXT.md` — domain vocabulary for Team B ERD ("ฝั่งเนยสด"): admission round, education level, application-as-log, มอบตัว (enrollment snapshot), classroom vs exam room, EducationLevels/educationStage/AcademicYears/Semesters. Contains dated amendments from grill sessions (2026-11-05/06/07). **Check this before analysis involving data model terms.** (It used to live at `materials/doc/CONTEXT.md` — that path is gone, don't use it.)
- `materials/doc/final-report.md` is the AI-facing SSOT (SRS + project documentation), generated from the source docx — the docx is the authority if they conflict.

## Open / pending

1. **No `AGENTS.md` at repo root yet.** I offered to create a pointer file telling agents that `materials/doc/final-report.md` is the SSOT. User hasn't confirmed — ask before creating.
2. User mentioned upcoming **analysis tasks** — scope not yet defined. Start by reading `final-report.md` + `CONTEXT.md`.
3. Nothing has been committed to git this session (script + md + images are untracked/working-tree only). Don't commit unless asked.

## Suggested skills for the next agent

- `codebase-design` / `improve-codebase-architecture` — if the analysis work is architecture-level (likely, given the two-backend split).
- `domain-modeling` — if analysis touches ERD/terminology; extends `materials/ai-bro/CONTEXT.md`.
- `code-review` — if reviewing branch changes against the spec in `final-report.md`.
