# AgentClinic — Implementation Plan

Series of numbered task groups derived from `specs/roadmap.md`.

## Task Group 1 — Scaffold (Done)

- 1.1 Initialise TypeScript project with strict `tsconfig.json`.
- 1.2 Install Express, better-sqlite3, and dev tooling (`tsx`, type packages).
- 1.3 Add `build` (tsc), `start` (node dist), `dev` (tsx watch) scripts.
- 1.4 Open the SQLite database (`data/agentclinic.db`) with WAL + foreign keys.
- 1.5 Add a migrations runner; create the `agents` table.
- 1.6 Serve a health/dashboard route and verify the server boots.

## Task Group 2 — Agents (Done)

- 2.1 Agents CRUD API at `/api/agents` (list, get by id, create, patch, delete).
- 2.2 Validate input; return 400 on invalid payloads, 404 on missing agents, 204 on delete.
- 2.3 Render an agents dashboard at `/` using the Header/Main/Footer/Layout components.
- 2.4 Move styles to `public/styles.css` and serve via `express.static`.
- 2.5 Make the layout responsive: mobile-first media queries and a
  horizontally scrollable `.table-wrap` for tables.

## Task Group 3 — Ailments & Therapies (Next)

- 3.1 Data model and migration for ailments (an AgentClinic table describing conditions).
- 3.2 Data model and migration for therapies (treatments available at the clinic).
- 3.3 Link agents to therapies (many-to-many or therapy assignments table).
- 3.4 CRUD endpoints for ailments and therapies; endpoints to manage agent-therapy links.
- 3.5 Dashboard sections listing ailments and therapies.

## Task Group 4 — Bookings

- 4.1 Data model and migration for appointments (agent + human + time slot + status).
- 4.2 CRUD endpoints for appointments, scoped by agent and cliniologist/human.
- 4.3 Booking flow to schedule, reschedule, and cancel appointments.
- 4.4 Dashboard UI to view and manage upcoming bookings.

## Task Group 5 — Polish

- 5.1 Refine the visual design for an attractive, modern-browser experience.
- 5.2 Verify responsive behaviour across phone, tablet, and desktop
  viewports (nav, spacing, table scrolling, empty states).
- 5.3 Confirm navigation across all dashboard sections for agents and staff.
- 5.4 Reliability pass (error handling, empty states, validation gaps).
- 5.5 Final cleanup and full validation before merge.