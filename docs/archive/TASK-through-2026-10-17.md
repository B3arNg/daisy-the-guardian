# TASK.md — Daisy the Guardian

Live work board. Read this before starting; update it when a task changes state. Append dated
entries rather than rewriting history. Architecture lives in `PROJECT_OVERVIEW.md`.

## Repo state (2026-08-25)

- Branch **`develop`** (active), at `018a08c` *"Docs: Updated DESIGN.md to reflect the actual
  Daisy the Guardian design system"*. `main` also exists; both track `origin`.
- Uncommitted working-tree changes:
  - `AGENTS.md` — modified, adds a "Global workflow integration" section (CLI-first routing,
    `temp-artifact/`, maintain `PROJECT_OVERVIEW.md` + `TASK.md`). **Not committed.**
  - `SUMMARY.md` — untracked phase-1 briefing dated May 2026.
  - `PROJECT_OVERVIEW.md`, `TASK.md` — new, this pass.
- Verification gate is `npm run lint` + `npm run build`. There is no test suite.

## In progress

- Localhost dev server running on `http://localhost:3000` for user evaluation and testing.

## Next

- [ ] Decide whether to commit the modified `AGENTS.md` and untracked `SUMMARY.md`, or drop them.
- [ ] Replace the `create-next-app` boilerplate `README.md` — it claims `next/font` + Geist,
      which is false (fonts are Google Fonts `<link>`s in `layout.tsx`).
- [ ] Move `lint_results.txt` and `design_base64.txt` out of the repo root into
      `temp-artifact/` (now gitignored), or delete them.

## Blocked

Nothing blocked.

## Completed

### 2026-08-27
- Generated full-fidelity screen redesign via Stitch MCP (`screen/1675208557de4a25b9bb884d9edbf85a` - "Daisy the Guardian - Pixel Hearth Sanctuary") ensuring clean transparent background constraints for all pixel art elements.
- Exported and inspected screenshot at `temp-artifact/pixel_hearth_full_screen.png` and HTML template at `temp-artifact/pixel_hearth_full_screen.html`.
- Processed and extracted 17 clean transparent PNG/GIF pixel art sprites into `public/pixel-assets/` (isolated alpha channels, no background matte/artifacts, donut hole transparency cleared).
- Implemented the complete 16-Bit Pixel Art Redesign across the web application (Next.js components, layout, globals.css, theme).
- Verified build gate via `npm run build` (passed 100%).

### 2026-08-25
- Created `PROJECT_OVERVIEW.md` and `TASK.md`. `AGENTS.md` had referred to both as tracked
  repo-root files, but neither existed — the docs described a state the repo had not reached.
- Added `temp-artifact/` to `.gitignore`.

## Decisions

- **Docs are tracked in git here** (not gitignored). Sibling projects AE-Flow and AJ-lms keep
  theirs local; daisy does not, because `AGENTS.md` specifies "tracked repository-root".
- **`CLAUDE.md` stays a one-line `@AGENTS.md` pointer.** Claude and Codex share one rule file;
  write project rules into `AGENTS.md`, never duplicate them into `CLAUDE.md`.
- **No service-role key.** Security is RLS-only. Adding edit/delete UI means writing the RLS
  policies first — the app currently only ever `select`s and `insert`s.

## Hand-off notes

Next.js here is **16.2.6**, which `AGENTS.md` flags as diverging from common training data.
Read `node_modules/next/dist/docs/` before writing framework code rather than assuming
App Router conventions.

## Project credential checkpoint — 2026-10-07

URL/anon key identity matches this project and env is byte-identical to Windows. The host was unreachable during read-only verification; the earlier account report says paused. Do not claim live credentials accepted or resume the project without authorization. Application credentials stay in `.env.local`. Private `.env.control.local` (0600, Git-ignored) records target `tyqvfgvxoiwkwrckzanu` and has an empty owning-account PAT field. Management/CLI control remains unconfigured until a usable local PAT is supplied; project AGENTS.md prohibits global credential/login fallback. No application code, global account login, database rows, migrations, deployment or token creation changed.

## Project credential continuation — 2026-10-09

Fresh read-only app authentication checks passed HTTP 200 for the existing public key. Original .env.local is backed up and unchanged; the control PAT is still blank. Owner verification and isolated browser authentication are in progress before scoped-token creation. Target: tyqvfgvxoiwkwrckzanu. The earlier unreachable-host result is historical; current public-key authentication succeeds. No app started, business rows accessed, migration, deployment, key rotation or global credential change.

- Browser checkpoint 2026-10-09: isolated Linux Orca profile supabase-owner-b3ar has a prepared Supabase sign-in tab for b3ar.nqm@gmail.com. Account/project verification awaits interactive authentication; no token created or installed. Private env files remain byte-identical to their backups, mode 0600 and Git-ignored. Daisy tab is focused; Tram test-only tab is prepared in background. Sanitized browser evidence: workspace temp-artifact/supabase-project-control-20261009/browser-account-verification-result.json and this project temp-artifact/supabase-control-20261009/auth-required-checkpoint.json.

## Scoped control access configured — 2026-10-09

Verified the live owning account b3ar.nqm@gmail.com and exact Daisy project tyqvfgvxoiwkwrckzanu (daisy-the-guardian, B3arNg). Created one project-scoped PAT named Daisy Linux development 2026-10-09, expires 2027-01-07, and saved it only in private, Git-ignored .env.control.local (0600). Grants: Project Settings, API Keys, API Key Secrets and Logs Read; Database and Migrations Read-write. All other 40 permissions are None; one project only. Existing app .env.local is byte-identical to its backup and no service-role key was added.

Read-only validation passed: exact-project Management API GET 200, ACTIVE_HEALTHY; existing Supabase CLI 2.111.0 authenticated, four returned API keys included the unchanged local app key; child env loading selected the repository PAT despite an inherited sentinel. Daisy has no own CLI installation: validation reused /home/b3arnqm/Work/workflow-web/node_modules/supabase/dist/supabase.js with Daisy cwd, child-only credentials and explicit --project-ref. The one-time secret view was cleared and exactly one new named token is listed. Database and migration writes were not tested; app was not started. No app API-key rotation, existing-token changes, project runtime changes, global credentials, deployments or production work.

Evidence: temp-artifact/supabase-control-20261009/control-verification.json, review-verification.json, form-permission-catalog.json and token-list-metadata.json. Original env backups remain private under that folder. Future control commands must require this local PAT, clear inherited SUPABASE_ACCESS_TOKEN in the child and verify the explicit target before mutations; no global fallback. Cross-project instructions: /home/b3arnqm/Work/SUPABASE-PROJECT-CREDENTIALS.md.

## Windows token synchronization - 2026-10-09

The same project-scoped control PAT is now installed in the matching Windows repository .env.control.local, Git-ignored with restricted NTFS ACLs. Windows exact-project Management API GET 200, CLI 2.111.0 authentication, exact transfer and child-only credential isolation passed; existing app env files were preserved. The invalid Windows user-level SUPABASE_ACCESS_TOKEN (401) was backed up privately and cleared; no separate saved CLI credential was present. Windows AGENTS.md and SUPABASE-CONTROL.md document explicit local-token loading that overrides inherited stale values. Token expiry is unchanged; revocation affects both Linux and Windows. Trăm production excluded. Evidence: workspace temp-artifact/windows-supabase-token-sync-20261009/installation-report.json and completion.json.
