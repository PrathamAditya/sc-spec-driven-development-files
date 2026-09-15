# MVP — Implementation Plan

Series of numbered task groups to complete the MVP, derived from
`specs/roadmap.md` Phase 3 (Bookings) and the essential parts of Phase 4
(Polish). Phases 1 and 2 (scaffold, agents, ailments, therapies) are done.

## Task Group 1 — Bookings data model

- 1.1 Add a migration creating the `appointments` table
  (id, agent_id FK → agents, human, starts_at, status, created_at).
- 1.2 Keep SQLite conventions: AUTOINCREMENT id, `datetime('now')` default,
  `FOREIGN KEY ... ON DELETE CASCADE` (mirrors `agent_therapies`).

## Task Group 2 — Bookings CRUD API

- 2.1 Endpoints at `/api/bookings` (list, get by id, create, patch, delete)
  with the same validation/status conventions as agents (400/404/204).
- 2.2 Validate payload: required agent_id (exists → else 404) and starts_at;
  `human` optional; `status` defaults to `scheduled`.
- 2.3 List bookings scoped to an agent at `/api/agents/:id/bookings`.
- 2.4 Cancel via status transition (`status = cancelled`) on PATCH;
  DELETE removes the booking.

## Task Group 3 — Booking flow (schedule → manage)

- 3.1 Create a booking for an agent with a chosen time and human.
- 3.2 Reschedule (PATCH starts_at) and cancel (PATCH status).
- 3.3 Sensible empty states and 404s throughout (unknown agent/booking).

## Task Group 4 — Bookings dashboard UI

- 4.1 Render a Bookings section in the dashboard (agent, human, time,
  status), listing upcoming bookings first.
- 4.2 Add navigation across Agents / Ailments / Therapies / Bookings in the
  header nav component.
- 4.3 Reuse the responsive layout (`public/styles.css`, scrollable tables).

## Task Group 5 — Polish (MVP essentials)

- 5.1 Navigation across all dashboard sections for agents and staff.
- 5.2 Empty states for every section (e.g. "No bookings yet").
- 5.3 Responsive verification on phone/tablet/desktop viewports.
- 5.4 Reliability pass: consistent validation and error handling.
- 5.5 Full validation run per `validation.md` before merge.

## Notes

- Unit + API smoke tests are added under the root `tests/` folder
  (`specs/tech-stack.md`); bookings tests mirror `tests/ailments.test.ts`
  and `tests/agentTherapies.test.ts`.
- No changes expected to the entities/APIs built in earlier phases.