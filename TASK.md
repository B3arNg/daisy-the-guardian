# TASK.md — Daisy the Guardian

Live work board: current job, open items, decisions, handoff. Architecture is in `PROJECT_OVERVIEW.md`. Keep this at 8 KB or less; when a job finishes, archive it to `docs/archive/TASK-through-<date>.md`. Full history through 2026-10-17: `docs/archive/TASK-through-2026-10-17.md` (read only when a pointer sends you there).

## Repo state (2026-10-20)

- Integration branch: `develop`, now including `feature/omarchy-continuation-20261020`. The feature branch is retained for traceability; `main` remains separate.
- Snapshot: the 16-bit Pixel Hearth redesign, source sprites, design/architecture/operations docs and agent navigation. Generated Supabase CLI state is excluded; private env files remain ignored.
- Verification (2026-10-20): lint passes with 20 non-blocking warnings, and build passes. Four lint errors were repaired: unknown auth errors are narrowed, loading changes run in asynchronous auth response callbacks, and chart time is stored outside render. No test suite exists.

## Active

No active implementation task. The reviewed continuation snapshot is integrated into `develop`; merge/pull receipts are maintained in workspace `docs/git-merge-windows-20261020.md`. Browser acceptance remains open below; hosted-data writes were not part of the repository checks.

## Open items

- [ ] Review the redesign in the browser before promoting it. The header cheddar/streak badges are static design values; no reward or streak persistence is implemented.
- [ ] Replace the boilerplate `README.md` (it wrongly claims `next/font` + Geist; fonts are Google Fonts `<link>`s).
- [ ] Move `lint_results.txt` and `design_base64.txt` out of the repo root into `temp-artifact/` (gitignored) or delete them.
- [ ] Untested: database writes, migrations, deployment from the new credential setup; the Supabase project had been reported paused before 2026-10-09, re-check before relying on it.

## Decisions

- Project documentation and the redesign are tracked in Git. Keep Windows' own coordination files rather than replacing them with another host's working notes.
- `CLAUDE.md` stays a one-line `@AGENTS.md` pointer; write rules into `AGENTS.md`.
- No service-role key. Security is RLS-only; the app only `select`s and `insert`s, so edit/delete UI needs RLS policies first.
- Next.js is 16.2.6, which diverges from common training data: read `node_modules/next/dist/docs/` before writing framework code.
- Credentials: private `.env.local` (app) and `.env.control.local` (project-scoped control token), both Git-ignored. Use them per project in a child process with an explicit project ref; no global login. Never copy values into docs.

## Documentation layout

Project documents consolidated under `docs/`. [Completed task and verification](docs/archive/TASK-through-2026-10-18.md).
