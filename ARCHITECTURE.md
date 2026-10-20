# Daisy the Guardian architecture

Private mood journaling app with an emotion selector, history and weekly charts.

Stack: Next.js, React and Supabase. Dependency versions and commands are defined in [package.json](<package.json>).

## Source map

| Source | Responsibility |
|---|---|
| [src/app](<src/app>) | App Router pages, layout and styles |
| [src/components](<src/components>) | Authentication, dashboard and emotion UI |
| [src/data](<src/data>) | Application data definitions |
| [src/utils](<src/utils>) | Shared utilities and service integration |
| [public](<public>) | Static assets |

## Existing architecture and contracts

No separate architecture reference predates this map. The source paths above define the inspected checkout layout.

Follow the existing Pixel Hearth design system and keep mood entries scoped to their authenticated owner. Recheck the current implementation before treating an older overview as shipped behavior.

## Documentation boundaries

[Documentation index](<docs/README.md>) routes to design decisions, product scope, plans, schema provenance and operational references. Detailed sources live under `docs/` and retain their existing authority. `PROJECT_OVERVIEW.md` and `TASK.md` hold host-local status under the project's existing tracking policy.

Source paths and navigation checked on 2026-10-18. Linked content keeps its own verification date; product behavior and runtime health were not revalidated.
