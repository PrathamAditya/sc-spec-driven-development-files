# Ailments & Therapies — Implementation Plan

Series of numbered task groups for the Ailments & Therapies feature,
derived from `specs/140926-211825/plan.md` subtasks 2.6–2.10 and
`specs/roadmap.md` Phase 2.

## Task Group 1 — Ailments data model

- 1.1 Add a migration creating the `ailments` table
  (id, name, description, created_at).
- 1.2 Keep SQLite conventions: AUTOINCREMENT id, `datetime('now')` default.

## Task Group 2 — Therapies data model

- 2.1 Add a migration creating the `therapies` table
  (id, name, description, applies_to, created_at).
- 2.2 Keep SQLite conventions: AUTOINCREMENT id, `datetime('now')` default.

## Task Group 3 — Agent–therapy links

- 3.1 Add a migration creating an `agent_therapies` junction table
  (agent_id, therapy_id, UNIQUE(agent_id, therapy_id)) with foreign keys
  on both columns.
- 3.2 Ensure `PRAGMA foreign_keys = ON` is active (already in `src/db.ts`).

## Task Group 4 — CRUD API

- 4.1 Ailments endpoints at `/api/ailments` (list, get by id, create, patch, delete)
  with the same validation/status conventions as agents (400/404/204).
- 4.2 Therapies endpoints at `/api/therapies` (list, get by id, create, patch, delete).
- 4.3 Link endpoints to assign/unassign therapies to agents:
  `/api/agents/:id/therapies` (list, assign, remove); 404 on unknown agent/therapy.
- 4.4 Reject duplicate agent–therapy assignments gracefully.

## Task Group 5 — Dashboard sections

- 5.1 Render an Ailments section in the dashboard (list, name, description).
- 5.2 Render a Therapies section in the dashboard.
- 5.3 Show each agent's assigned therapies.
- 5.4 Reuse the responsive layout (`public/styles.css`, scrollable tables)
  so new sections behave well on small screens.

## Task Group 6 — Validation pass

- 6.1 `npm run build` and `npm test` green.
- 6.2 Manual browser check per `validation.md`.

## Notes

- No agents changes are required; use the `agents` module as the
  structural template for the new modules.