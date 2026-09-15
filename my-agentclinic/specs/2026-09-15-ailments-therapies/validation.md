# Ailments & Therapies — Validation

How we know the Ailments & Therapies implementation has succeeded and can
be merged back.

## Automatic gates

- [ ] `npm run build` (strict `tsc`) completes with zero errors.
- [ ] `npm test` (Vitest) passes, including API smoke tests for:
  - `/api/ailments`: create → list → get → patch → delete happy path,
    and 400 on invalid payload, 404 on missing id.
  - `/api/therapies`: same happy/error paths.
  - `/api/agents/:id/therapies`: list, assign, remove; 404 on unknown
    agent or therapy; duplicate assignment handled gracefully.

## Manual gates

- [ ] Server starts cleanly with `npm run dev`.
- [ ] Dashboard shows Ailments and Therapies sections with data from the
  database; each agent lists its assigned therapies.
- [ ] Layout stays responsive: new tables scroll inside `.table-wrap`
  on small screens; no horizontal page overflow.
- [ ] Empty states are sensible (e.g. "No ailments yet").

## Spec sync

- [ ] `specs/roadmap.md` updated: Phase 2 Ailments & Therapies portion
  marked done.
- [ ] `specs/140926-211825/plan.md` subtasks 2.6–2.10 marked done.
- [ ] Feature docs (`specs/2026-09-15-ailments-therapies/`) reflect the
  implemented code (entities, endpoints, dashboard sections).
- [ ] CHANGELOG.md updated on this branch before merging (newest date
  heading at top of the project root changelog).

## Merge readiness

- [ ] Branch `feat/ailments-therapies` cleanly rebased on its base.
- [ ] `git diff` reviewed and limited to the feature's scope.
- [ ] No leftover debug output or secrets.
- [ ] All checks above green. Only then merge.