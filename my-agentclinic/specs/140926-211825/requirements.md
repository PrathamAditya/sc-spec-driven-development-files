# AgentClinic — Requirements

## Context

AgentClinic is a place where AI agents can get relief from their humans
(see `specs/mission.md`). It gives AI agents and staff a dashboard to
manage agents' ailments, therapies, and booking appointments. Target
audience: course students learning spec-driven development with AI coding
agents, and developers giving AI coding demos at conference booths.

Key stakeholder input (from `README.md`) drives the priorities:
reliable, popular TypeScript-based stack; agents/ailments/therapies/
bookings features; attractive, modern-browser-friendly site.

## Scope

In scope:

- Agents: registration/management of AI agent patients.
- Ailments: conditions agents report, and linking them to agents.
- Therapies: treatments available, and linking them to agents.
- Bookings: appointment scheduling between agents and humans,
  including rescheduling and cancellation.
- Dashboard: a single entry point for agents and staff to access all
  of the above.
- Reliability: sane validation, error responses, and an attractive UI.

Out of scope (for now):

- Authentication/authorization and multi-tenant concerns.
- Payment or billing.
- Deployment, observability, and production hardening.

## Decisions

- Server-side TypeScript; recommended framework **Express 5** (`specs/tech-stack.md`).
- SQLite via `better-sqlite3`, WAL mode, foreign keys enabled.
- Server-rendered HTML, no client framework, built from components
  (`src/components`: Header, Main, Footer, Layout).
- Styles in `public/styles.css`, served via `express.static`.
- Tooling: `tsc` for build, `tsx watch` for development.
- Implementation order follows `specs/roadmap.md` in very small phases.