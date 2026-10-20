# Daisy the Guardian — Project Overview

> Living document. Re-derive after any refactor that changes stack, schema, or data flow.
> Derived from source at commit `018a08c` on branch `develop` (2026-08-25):
> 12 files under `src/`, ~1000 lines, 5 components, 1 table.

## 1. What This Is

A private emotional-wellness sanctuary styled after cozy 16-bit retro RPGs (Stardew Valley / Tamagotchi). A user crafts a mood treat through a three-step wheel (Core → Secondary → Tertiary), attaches a traveler's note, and sees their quest history as a filterable retro archive plus a weekly emotional rhythm volume chart. Single-user-scoped: everyone sees only their own rows.

Design system is **Pixel Hearth** — warm parchment canvas (`#FFFDF0` / `#FDF6E2`), dark chocolate ink outlines (`#2B1E16`), authentic 16-bit typography (`Press Start 2P`, `VT323`, `Silkscreen`), 3D block-press buttons, and transparent pixel food/snack sprites. Brand and tone live in `DESIGN.md`.

## 2. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16.2.6** (App Router) | `next dev` uses Turbopack. `next.config.ts` is empty |
| UI | **React 19.2.4** | Client components with 16-bit pixel RPG layouts |
| Styling | **Tailwind CSS v4** via `@tailwindcss/postcss` | Custom pixel classes (`.pixel-box`, `.pixel-btn`, `.pixel-art`) in `src/app/globals.css` |
| Sprites & Assets | **16-bit Pixel Sprites** | Located in `public/pixel-assets/` with clean alpha transparency |
| Charts | **Stepped 16-Bit Bar Chart** | Custom responsive pixel rhythm chart with snack markers |
| Language | **TypeScript 5** | |
| Backend | **Supabase** (`@supabase/supabase-js` 2.105.4) | Postgres + Auth + Realtime. No API routes, no server actions |
| Lint | ESLint 9 + `eslint-config-next` 16.2.6 | `npm run lint` runs bare `eslint` |
| Tests | **none** | No test runner, no CI workflow in-repo |
| Deploy | Vercel | Live at `daisy-the-guardian.vercel.app` |

**Next.js 16 caveat:** `AGENTS.md` warns that this Next version has breaking changes versus
common training data. Consult `node_modules/next/dist/docs/` before writing framework code.

**Typography:** Google Fonts `<link>` tags in `src/app/layout.tsx` (Press Start 2P, VT323, Silkscreen, Plus Jakarta Sans, Material Symbols Outlined).

## 3. Repository Layout

```
public/
  pixel-assets/       17 clean transparent PNG/GIF pixel art assets (Daisy hamster & snack treats)
src/
  app/
    layout.tsx        root layout; pixel font <link>s, metadata
    page.tsx          session gate — 16-bit HUD, RPG dialogue companion box, tabs
    globals.css       Tailwind layers + pixel borders, block shadows, 3D button press, animations
  components/
    Auth.tsx          16-bit arcade cartridge authentication frame
    EmotionSelector.tsx  Treat Crafter 3-step mood logging with transparent snack sprites
    Dashboard.tsx     Quest Archive grid, timeframe & emotion filters, realtime subscription
    WeeklyChart.tsx   7-day stepped emotional rhythm chart with floating snack markers
    Skeleton.tsx      Pixelated loading shimmer primitive
  data/
    emotions.ts       static 3-level emotion wheel (Joy / Sadness / Anger / Fear / …)
  utils/
    supabase.ts       single browser client from the two NEXT_PUBLIC_ env vars
```

## 4. Data Model

One table: **`emotion_logs`**.

| Column | Notes |
|---|---|
| `id` | uuid, primary key |
| `user_id` | uuid → `auth.users`; every query filters on it |
| `core_emotion` | required |
| `secondary_emotion` | required |
| `tertiary_emotion` | required |
| `notes` | free text — **plural**, easy to mistype as `note` |
| `created_at` | timestamptz; sort and filter key |

**Access surface is deliberately narrow.** The app only ever calls `.select()` and `.insert()`.
There is no update or delete path anywhere in `src/`, and RLS is documented as SELECT/INSERT
only (`auth.uid() = user_id`). **Adding edit or delete UI requires writing the matching RLS
policies first** — without them the calls fail silently at the policy layer.

## 5. Auth & Security

- Supabase Auth: email/password (`signUp`, `signInWithPassword`) and Google OAuth
  (`signInWithOAuth`).
- `src/app/page.tsx` is the gate: `getSession()` on mount plus an `onAuthStateChange`
  subscription; unauthenticated renders `<Auth />`.
- **Only the anon key exists.** `.env.local` holds `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` — no service-role key anywhere. All tenancy is enforced by
  RLS in the database, not by application code. That is the security model; don't add a
  service-role key to work around a policy.
- `utils/supabase.ts` degrades to empty strings + a console warning when env is missing, so a
  build succeeds without credentials but the app cannot read or write.

## 6. Realtime

Two Postgres-changes channels, each torn down on unmount via `removeChannel`:
`dashboard_emotion_logs` (Dashboard) and `weekly_emotion_logs` (WeeklyChart). Both refetch on
change rather than patching local state.

## 7. Run / Verify / Deploy

```bash
npm run dev     # Turbopack, http://localhost:3000
npm run lint    # bare eslint
npm run build   # next build
npm start
```

No test suite exists — `lint` + `build` is the whole gate. Branches: `develop` (active) and
`main`, both pushed to `origin`. Vercel deploys via GitHub CI/CD.

## 8. Known Gaps

- No tests, no in-repo CI workflow.
- `README.md` is untouched boilerplate and actively misleading (see font drift above).
- `lint_results.txt` and `design_base64.txt` sit at the repo root as build/scratch residue —
  they belong in `temp-artifact/`.
- No error tracking (no Sentry/PostHog).
- Roadmap ideas (AI mood insights, streaks, mood triggers, PDF export) live in `SUMMARY.md`
  and are unstarted.

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
