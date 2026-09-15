# Ailments & Therapies — Validation

How we know the Ailments & Therapies implementation has succeeded and can
be merged back.

Status: **ALL GATES GREEN** (run 2026-09-15).

## Automatic gates

- [x] `npm run build` (strict `tsc`) completes with zero errors.
- [x] `npm test` (Vitest) passes, including API smoke tests in the
  `tests/` folder (test files live there, per `specs/tech-stack.md`):
  - `/api/ailments`: create → list → get → patch → delete happy path,
    and 400 on invalid payload, 404 on missing id.
  - `/api/therapies`: same happy/error paths.
  - `/api/agents/:id/therapies`: list, assign, remove; 404 on unknown
    agent or therapy; duplicate assignment handled gracefully (409).

## Manual gates

- [x] Server starts cleanly with `npm run dev`.
- [x] Dashboard shows Ailments and Therapies sections with data from the
  database; each agent lists its assigned therapies.
- [x] Layout stays responsive: new tables scroll inside `.table-wrap`
  on small screens; no horizontal page overflow.
- [x] Empty states are sensible (e.g. "No ailments yet").

## Spec sync

- [x] `specs/roadmap.md` updated: Phase 2 Ailments & Therapies portion
  marked done.
- [x] `specs/140926-211825/plan.md` subtasks 2.6–2.10 marked done.
- [x] Feature docs (`specs/2026-09-15-ailments-therapies/`) reflect the
  implemented code (entities, endpoints, dashboard sections).
- [x] CHANGELOG.md updated on this branch before merging (newest date
  heading at top of the project root changelog).

## Merge readiness

- [x] Branch `feat/ailments-therapies` cleanly rebased on its base.
- [x] `git diff` reviewed and limited to the feature's scope.
- [x] No leftover debug output or secrets.
- [x] All checks above green. Only then merge. — Ready to merge.