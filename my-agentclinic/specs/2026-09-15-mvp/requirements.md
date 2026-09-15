# MVP — Requirements

## Context

AgentClinic is a place where AI agents can get relief from their humans
(see `specs/mission.md`). The MVP targets the course and conference-demo
audience: a tool an agent (or a presenter) can use in front of a booth or
classroom and walk through the whole journey on one screen.

Tech-stack guidance (`specs/tech-stack.md`): TypeScript (strict), Express 5,
SQLite via `better-sqlite3` (WAL + FK), server-rendered component UI styled
by `public/styles.css`, responsive (mobile-first) design, validated with
Vitest (test files in the root `tests/` folder).

Phases 1 and 2 (`specs/roadmap.md`) are done: scaffold, agents, ailments,
therapies, and agent–therapy linking all exist with full CRUD and tests.
The MVP adds the last roadmap piece — **Bookings** — plus the essentials of
**Polish**, mirroring the completed `specs/2026-09-15-ailments-therapies/`.

## Scope

In scope (full demoable MVP):

- Everything already built: agents, ailments, therapies, agent–therapy
  assignments.
- `appointments` entity: an agent books a slot with a human
  (agent_id, human, starts_at, status).
- Bookings CRUD: `/api/bookings` (create, list, get, reschedule, cancel,
  delete) with 400/404/204 conventions; scoped booking list at
  `/api/agents/:id/bookings`.
- Dashboard and section pages covering Agents, Ailments, Therapies, and
  Bookings, with navigation, active-link state, empty states, and a
  responsive layout.
- Navigation works as real page links (header nav → `/agents`, `/ailments`,
  `/therapies`, `/bookings`); `/` is the all-sections overview.
- Vitest unit + API smoke tests for the bookings endpoints.

Out of scope (post-MVP):

- Authentication/authorization and multi-tenant concerns.
- Payments/billing.
- Treatment progress tracking or outcomes (deferred as a later feature).
- Time-slot conflict detection beyond manual review.
- Deployment, observability, production hardening.

## Decisions

- MVP = Phases 1–3 complete plus the essential Polish tasks; anything
  beyond that is deferred (see Out of scope).
- `appointments` table mirrors the existing entity pattern: AUTOINCREMENT
  id, required agent_id with FK (cascade delete), required starts_at,
  optional human, `status` enum text defaulting to `scheduled`
  (`scheduled` | `cancelled`).
- Express 5 router in `src/bookings.ts` mounted at `/api/bookings`,
  following `src/ailments.ts` / `src/therapies.ts` shape.
- Bookings per agent exposed as sub-routes of the agents router
  (`/api/agents/:id/bookings`), like `/:id/therapies`.
- Dashboard and tests reuse the existing components, styles, and test
  conventions (`tests/`, in-memory SQLite via `AGENTCLINIC_DB`).