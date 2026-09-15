# MVP — Validation

How we know the MVP implementation has succeeded and can be merged back.

Status: not yet run.

## Automatic gates

- [ ] `npm run build` (strict `tsc`) completes with zero errors.
- [ ] `npm test` (Vitest) passes, including API smoke tests in `tests/`
  for:
  - `/api/bookings`: create → list → get → reschedule (PATCH) →
    cancel → delete happy path; 400 on invalid payload; 404 on missing
    booking or unknown agent.
  - `/api/agents/:id/bookings`: list scoped to an agent; 404 on unknown
    agent.
  - Existing suites (agents, ailments, therapies, assignments, escapeHtml)
    still pass.

## Manual gates

- [ ] Server starts cleanly with `npm run dev`.
- [ ] Dashboard shows Agents, Ailments, Therapies, and Bookings sections;
  bookings appear with agent, human, time, and status.
- [ ] Header nav lets you reach every section.
- [ ] Empty states are sensible for every section.
- [ ] Layout stays responsive: new tables scroll inside `.table-wrap`
  on small screens; no horizontal page overflow.

## Spec sync

- [ ] `specs/roadmap.md` updated: Phase 3 done; Phase 4 polish items done.
- [ ] `specs/2026-09-15-mvp/plan.md` task groups marked done.
- [ ] Feature docs reflect the implemented code (appointments entity,
  booking endpoints, dashboard sections, tests).
- [ ] CHANGELOG.md updated on this branch before merging (newest date
  heading at top of the project root changelog).

## Merge readiness

- [ ] Branch `mvp` cleanly rebased on its base.
- [ ] `git diff` reviewed and limited to MVP scope.
- [ ] No leftover debug output or secrets.
- [ ] All checks above green. Only then merge.