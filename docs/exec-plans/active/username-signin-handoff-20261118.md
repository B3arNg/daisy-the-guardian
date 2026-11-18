# Handoff: Night Hearth theme and username sign-in (2026-11-18)

Written on Omarchy for continuing on Windows. Each host keeps its own `TASK.md` and `PROJECT_OVERVIEW.md`; this file carries the state instead. No secret values appear here.

## What changed (branch `develop`)

- **Night Hearth theme.** Colors are semantic tokens in `src/app/globals.css` (`:root` = light, `.dark` = dark; `html` is fixed to `dark`). Components use token classes (`bg-surface`, `text-ink`, `border-line`, `bg-gold`, `bg-joy-soft`, ...), not hex. Palette notes: `docs/DESIGN.md`.
- **Username sign-in.** Login accepts a username or an email. A username goes to `POST /api/auth/sign-in`, which resolves it with the server-only service-role key and returns only `access_token` and `refresh_token`; the browser calls `supabase.auth.setSession`. Email sign-in stays in the browser. Sign-up takes username + email + password; the `on_auth_user_created` trigger creates the `public.profiles` row from signup metadata. Header greeting reads the username from `profiles`.
- Files: `src/app/api/auth/sign-in/route.ts`, `src/lib/{server-sign-in,username,rate-limit}.ts`, `src/components/Auth.tsx`, `test/auth-username.test.mjs` (`npm test`, needs Node 22.6+), `supabase/migrations/20261117161232_profiles_username.sql`, `supabase/migrations/20261118120000_profiles_username_allow_dot.sql`.

## Hosted Supabase state (project `tyqvfgvxoiwkwrckzanu`, the only project; treat as production)

- Both migrations are already applied (history rows `profiles_username`, `profiles_username_allow_dot`). Do not re-run them.
- The two existing Google accounts have usernames `b3ar.nqm` and `phuongmaivu2015` and a deliberately weak password set on the owner's request; change it. Their Google identities are unchanged.
- Usernames: 3-20 characters of a-z, 0-9, underscore and dot.

## Windows setup (Git does not carry these)

1. `git pull --ff-only origin develop`. Windows `TASK.md` and `PROJECT_OVERVIEW.md` are local host files; keep yours and port the notes above by hand.
2. Add `SUPABASE_SERVICE_ROLE_KEY=` to Windows `.env.local` (server-only; never `NEXT_PUBLIC_`). Copy it privately from Omarchy's `.env.local` or the dashboard; do not paste it into chat or docs.
3. Replace the PAT in Windows `.env.control.local` with Omarchy's current one. The 2026-10-09 token lacked `project_admin_read`, `api_gateway_keys_read` and `database_read`; the replacement can read project metadata, API keys, run SQL and list migrations. Database/migration writes have only been exercised through the migrations endpoint and SQL query endpoint on Omarchy.
4. Child-only token loading and explicit project ref still apply (`AGENTS.md`).
5. `npm install`, then `npm run lint && npm test && npm run build`. Last Omarchy run: lint 0 errors (warnings only), 11/11 tests, build passes.

**Done 2026-11-18 over SSH from Omarchy:** `develop` pulled at `2dae5a1` (fast-forward), service-role key added to Windows `.env.local`, Windows `.env.control.local` replaced by the new scoped PAT (normalized hashes match Omarchy; the previous files are kept under `temp-artifact/env-backup-20261118/`, Git-ignored). Windows checks: lint 0 errors, 11/11 tests (`npm test` now uses a glob so it runs on Windows), build passes, PAT metadata/API-keys/migrations calls all 200. Steps 1-3 above need no further action; the Windows `TASK.md` and `PROJECT_OVERVIEW.md` still need the notes ported by hand.

## Open items

- **Security finding, not fixed.** `emotion_logs` has the permissive policies "Enable read for all users" (SELECT, `true`) and "Enable insert for all users" (INSERT, `true`) for role `public`. Anyone with the public anon key can read all mood logs and insert logs for any `user_id`. Dropping those two policies would not break the app (own-row policies remain; the UI filters by `user_id`). Needs the owner's go-ahead for a production write, then a check that a user sees only own rows and anon sees none.
- Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel (Preview and Production) before deploying; not done. No deployment was made.
- Untested: sign-up with a real email (confirmation mail), light mode, mobile widths, archive filters with real data, contrast audit.
- Google and older accounts have no profile unless one is added by SQL; an in-app "set username" step was offered but not built.

## Verification evidence

Throwaway users on the hosted project were created and deleted (2 real users, 0 stray profiles left). Verified: trigger creates lowercase profiles; username sign-in returns only tokens for the right account; wrong password and unknown username return the same 401; email sign-in unchanged; duplicate and malformed usernames rejected; profile RLS (own row only, no API writes, anon sees nothing). Browser: Orca built-in browser 1.4.259 (CLI version) against `localhost:3111`.
