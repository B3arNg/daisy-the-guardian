# Daisy the Guardian documentation

## Shared documentation map

| Topic | Start here |
|---|---|
| Architecture and source layers | [Architecture](../ARCHITECTURE.md) |
| Design decisions and durable constraints | [Design index](design-docs/index.md) |
| Product and interface scope | [Product specifications](product-specs/index.md) |
| Execution and technical debt | [Plan workflow](PLANS.md) |
| Schema provenance | [Schema index](generated/db-schema.md) |
| Sources and operational references | [References](references/README.md) |
| Visual design | [Design reference](DESIGN.md) |
| Frontend source map | [Frontend](FRONTEND.md) |
| Product context | [Product sense](PRODUCT_SENSE.md) |
| Quality evidence and gaps | [Quality status](QUALITY_SCORE.md) |
| Verification and operations | [Reliability](RELIABILITY.md) |
| Security boundaries | [Security](SECURITY.md) |
| Completed task history | [Archive guidance](archive/README.md) |

Keep `PROJECT_OVERVIEW.md` as a concise living snapshot and `TASK.md` as the current work board, following project-specific tracking rules.

Canonical design, product, reference and plan documents live under `docs/`; the root keeps README, agent entry points, architecture and the two coordination files. New substantial plans belong in `exec-plans/active/`, then move to `completed/` after verification. This map adds navigation and records unavailable material explicitly; it does not certify existing implementations.

Source paths and navigation checked on 2026-10-18. Linked content keeps its own verification date; product behavior and runtime health were not revalidated.

## Root entry points and private state

The root keeps README where present, agent instructions, `ARCHITECTURE.md`, `PROJECT_OVERVIEW.md` and `TASK.md`. Substantive product specifications, design systems, references, runbooks and plans live under `docs/`. Private native agent state, when present, stays in its native folders; dependency, build and temporary Markdown is outside this knowledge base.
