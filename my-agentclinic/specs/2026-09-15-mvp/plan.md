# MVP — Implementation Plan

Series of numbered task groups to complete the MVP, derived from
`specs/roadmap.md` Phase 3 (Bookings) and the essential parts of Phase 4
(Polish). Phases 1 and 2 (scaffold, agents, ailments, therapies) are done.

## Task Group 1 — Bookings data model (Done)

- 1.1 Add a migration creating the `appointments` table
  (id, agent_id FK → agents, human, starts_at, status, created_at). — Done
- 1.2 Keep SQLite conventions: AUTOINCREMENT id, `datetime('now')` default,
  `FOREIGN KEY ... ON DELETE CASCADE` (mirrors `agent_therapies`). — Done

## Task Group 2 — Bookings CRUD API (Done)

- 2.1 Endpoints at `/api/bookings` (list, get by id, create, patch, delete)
  with the same validation/status conventions as agents (400/404/204). — Done
- 2.2 Validate payload: required agent_id (exists → else 404) and starts_at;
  `human` optional; `status` defaults to `scheduled`. — Done
- 2.3 List bookings scoped to an agent at `/api/agents/:id/bookings`. — Done
- 2.4 Cancel via status transition (`status = cancelled`) on PATCH;
  DELETE removes the booking. — Done

## Task Group 3 — Booking flow (schedule → manage) (Done)

- 3.1 Create a booking for an agent with a chosen time and human. — Done
- 3.2 Reschedule (PATCH starts_at) and cancel (PATCH status). — Done
- 3.3 Sensible empty states and 404s throughout (unknown agent/booking). — Done

## Task Group 4 — Bookings dashboard UI (Done)

- 4.1 Render a Bookings **page** at `/bookings` (agent, human, time,
  status), listing upcoming (future) bookings before past ones; section
  pages for `/agents`, `/ailments`, `/therapies` too. — Done
- 4.2 Add navigation across Agents / Ailments / Therapies / Bookings in the
  header nav component, linking to the section pages (with active state);
  `/` remains the all-sections dashboard overview. — Done
- 4.3 Reuse the responsive layout (`public/styles.css`, scrollable tables). — Done

## Task Group 5 — Polish (MVP essentials) (Done)

- 5.1 Navigation across all dashboard sections for agents and staff. — Done
- 5.2 Empty states for every section (e.g. "No bookings yet"). — Done
- 5.3 Responsive verification on mobile (375 px) and desktop (1200 px)
  viewports via automated browser tests; tablet shares the mobile
  breakpoint. — Done
- 5.4 Reliability pass: consistent validation and error handling. — Done
- 5.5 Full validation run per `validation.md` before merge. — Done

## Notes

- Unit + API smoke tests are added under the root `tests/` folder
  (`specs/tech-stack.md`); bookings tests mirror `tests/ailments.test.ts`
  and `tests/agentTherapies.test.ts`.
- No changes expected to the entities/APIs built in earlier phases.