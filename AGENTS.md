<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Global workflow integration

The active global rules load first — Codex reads the global `AGENTS.md`, Claude Code reads the
global `CLAUDE.md` (this repo's `CLAUDE.md` is a one-line `@AGENTS.md` pointer, so both agents
land here). This file adds project-specific guidance and wins on direct conflicts.

- Follow the global CLI-first tool routing and use MCP only when an installed CLI cannot safely complete the task.
- Keep temporary artifacts, probes, and one-off helper scripts in the repository-root `temp-artifact/` directory.
- Read and maintain the tracked repository-root `PROJECT_OVERVIEW.md` and `TASK.md` for project status, active work, decisions, verification, and handoffs.
- The Next.js rule above overrides generic framework assumptions: consult the repository's installed Next.js documentation before external documentation or implementation changes.

## Supabase credentials

- Use this repository's private `.env.local` for application URL/API keys. Keep secret/service-role keys server-only.
- For CLI or Management API control, require an owning-account PAT in the Git-ignored, mode-0600 `.env.control.local`. Prefer a scoped PAT restricted to this project and permissions required by the authorized workflow; this is separate from application API keys.
- Pass the local PAT only to the child command, overriding any inherited global `SUPABASE_ACCESS_TOKEN`. Stop when it is empty, masked or invalid; do not fall back to global login/keyring credentials or switch dashboard accounts.
- Verify the intended project reference and access before mutations. Pass project flags explicitly; `SUPABASE_PROJECT_REF` in the local file records the target and is not automatically consumed by every CLI command. Never dump env files or reveal keys in tool output.

Application variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`; this app does not need a service-role key.
Read the intended target from `.env.control.local`, compare it with the app URL and TASK.md, and retain any staging/production identity guards.

## Documentation navigation

Start with [the documentation map](docs/README.md) and [architecture](ARCHITECTURE.md). Existing linked sources retain their authority. Place new substantial plans under `docs/exec-plans/active/` and move them to `completed/` only after acceptance is verified. Keep current state in the existing coordination files under this project's tracking rules; keep substantive documentation under `docs/` and preserve append-only archives.

Root Markdown is limited to README, agent entry points, `ARCHITECTURE.md`, `PROJECT_OVERVIEW.md` and `TASK.md`. Store substantive design, product, plan and reference documents under `docs/`; keep private native agent state in its native directories.
