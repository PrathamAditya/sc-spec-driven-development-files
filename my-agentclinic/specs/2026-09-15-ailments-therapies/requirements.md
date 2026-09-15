# Ailments & Therapies — Requirements

## Context

AgentClinic is a place where AI agents can get relief from their humans
(see `specs/mission.md`). This feature covers the Ailments & Therapies
portion of roadmap Phase 2 (`specs/roadmap.md`): the data models, linking,
and CRUD for ailments and therapies, plus dashboard sections to view them.

Tech-stack guidance (`specs/tech-stack.md`): TypeScript (strict), Express 5,
SQLite via `better-sqlite3` (WAL + FK), server-rendered component UI styled
by `public/styles.css` with responsive design, validated with Vitest.

The agents feature (Phase 2 first half) is done and serves as the template
for endpoints and conventions (validation → 400, missing → 404, delete → 204).

## Scope

In scope:

- `ailments` entity: conditions an agent reports (name, description).
- `therapies` entity: treatments the clinic offers (name, description,
  applies_to).
- Agent–therapy assignments via an `agent_therapies` junction table.
- CRUD APIs: `/api/ailments`, `/api/therapies`, and
  `/api/agents/:id/therapies` (list, assign, remove).
- Dashboard sections listing ailments, therapies, and each agent's
  assigned therapies, reusing the responsive layout.
- Validation and API smoke tests (Vitest), kept in the root `tests/`
  folder per `specs/tech-stack.md`.

Out of scope (for now):

- Booking/scheduling integration (belongs to roadmap Phase 3).
- Treatment progress tracking or outcomes.
- Restricting therapies per agent species beyond a free-text field.

## Decisions

- Two new entities mirror the `agents` entity pattern: AUTOINCREMENT id,
  required name, optional description, `datetime('now')` created_at.
- Many-to-many linking via a junction table with foreign keys and a
  UNIQUE constraint, so a therapy can apply to many agents and vice versa.
- Express 5 routers follow the `src/agents.ts` shape (`express.Router`),
  mounted in `src/index.ts`.
- Dashboard sections are server-rendered through the existing
  Header/Main/Footer/Layout components.
- Responsive behavior is inherited from `public/styles.css`
  (scrollable `.table-wrap`, mobile-friendly layout).
- Validation gates use Vitest (unit + API smoke tests) per
  `specs/tech-stack.md`.