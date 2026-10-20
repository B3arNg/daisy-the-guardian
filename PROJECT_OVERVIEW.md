# Daisy the Guardian — Project Overview

> Living document. Re-derive after any refactor that changes stack, schema, or data flow.
> Derived from source at commit `018a08c` on branch `develop` (2026-08-25):
> 12 files under `src/`, ~1000 lines, 5 components, 1 table.
>
> Trimmed 2026-10-17: dated credential checkpoints moved to `docs/archive/PROJECT_OVERVIEW-through-2026-10-17.md`; rewrite sections in place, never append dated entries.

## 1. What This Is

A private emotional-wellness sanctuary styled after cozy 16-bit retro RPGs (Stardew Valley / Tamagotchi). A user crafts a mood treat through a three-step wheel (Core → Secondary → Tertiary), attaches a traveler's note, and sees their quest history as a filterable retro archive plus a weekly emotional rhythm volume chart. Single-user-scoped: everyone sees only their own rows.

Design system is **Pixel Hearth** — warm parchment canvas (`#FFFDF0` / `#FDF6E2`), dark chocolate ink outlines (`#2B1E16`), authentic 16-bit typography (`Press Start 2P`, `VT323`, `Silkscreen`), 3D block-press buttons, and transparent pixel food/snack sprites. Brand and tone live in `docs/DESIGN.md`.

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
| Deploy | Vercel project `daisy-the-guardian` (Hobby team `b3arnqm`) | Live at `https://daisytheguardian.space` and `daisy-the-guardian.vercel.app` |

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
- Roadmap ideas (AI mood insights, streaks, mood triggers, PDF export) live in `docs/references/implementation-summary.md`
  and are unstarted.

## 9. Status and credentials (2026-10-17)

- Working tree on `develop` (HEAD `018a08c`) holds the uncommitted 16-bit pixel redesign (components, `globals.css`, `public/pixel-assets/`), plus untracked `Assets/`, `supabase/`, `docs/references/implementation-summary.md`. The project docs are also untracked here. Nothing is committed or pushed without an explicit request.
- Supabase project was ACTIVE_HEALTHY on 2026-10-09 (an earlier report said paused); read-only app-key checks passed on 2026-10-09. Application keys live in the private, Git-ignored `.env.local`; a project-scoped control token lives in `.env.control.local` (expires 2027-01-07; Windows holds a matching copy). Never copy values into docs.
- Control commands: use the repo-local token in a child process, clear any inherited `SUPABASE_ACCESS_TOKEN`, and pass the explicit project ref. No global login fallback. Cross-project rules: `../SUPABASE-PROJECT-CREDENTIALS.md` (Omarchy only; do not copy or quote it).
- Database writes, migrations and deployments were never exercised from this setup.

## Documentation map

See [the documentation index](docs/README.md) for the shared knowledge-base structure, [architecture](ARCHITECTURE.md) for source layers and existing references, and [quality status](docs/QUALITY_SCORE.md) for unassessed areas. Design, product and operational sources are consolidated under `docs/`; historical archives remain append-only.
