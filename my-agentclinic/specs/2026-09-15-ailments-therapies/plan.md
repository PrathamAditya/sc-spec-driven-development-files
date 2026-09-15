# Ailments & Therapies — Implementation Plan

Series of numbered task groups for the Ailments & Therapies feature,
derived from `specs/140926-211825/plan.md` subtasks 2.6–2.10 and
`specs/roadmap.md` Phase 2.

## Task Group 1 — Ailments data model (Done)

- 1.1 Add a migration creating the `ailments` table
  (id, name, description, created_at). — Done
- 1.2 Keep SQLite conventions: AUTOINCREMENT id, `datetime('now')` default. — Done

## Task Group 2 — Therapies data model (Done)

- 2.1 Add a migration creating the `therapies` table
  (id, name, description, applies_to, created_at). — Done
- 2.2 Keep SQLite conventions: AUTOINCREMENT id, `datetime('now')` default. — Done

## Task Group 3 — Agent–therapy links (Done)

- 3.1 Add a migration creating an `agent_therapies` junction table
  (agent_id, therapy_id, UNIQUE(agent_id, therapy_id)) with foreign keys
  on both columns. — Done
- 3.2 Ensure `PRAGMA foreign_keys = ON` is active (already in `src/db.ts`). — Done

## Task Group 4 — CRUD API (Done)

- 4.1 Ailments endpoints at `/api/ailments` (list, get by id, create, patch, delete)
  with the same validation/status conventions as agents (400/404/204). — Done
- 4.2 Therapies endpoints at `/api/therapies` (list, get by id, create, patch, delete). — Done
- 4.3 Link endpoints to assign/unassign therapies to agents:
  `/api/agents/:id/therapies` (list, assign, remove); 404 on unknown agent/therapy. — Done
- 4.4 Reject duplicate agent–therapy assignments gracefully (409). — Done

## Task Group 5 — Dashboard sections (Done)

- 5.1 Render an Ailments section in the dashboard (list, name, description). — Done
- 5.2 Render a Therapies section in the dashboard. — Done
- 5.3 Show each agent's assigned therapies. — Done
- 5.4 Reuse the responsive layout (`public/styles.css`, scrollable tables)
  so new sections behave well on small screens. — Done

## Task Group 6 — Validation pass (Done)

- 6.1 `npm run build` and `npm test` green; new Vitest tests are added
  under the root `tests/` folder (see `specs/tech-stack.md`). — Done
- 6.2 Manual browser check per `validation.md`. — Done

## Notes

- No agents changes are required; use the `agents` module as the
  structural template for the new modules.