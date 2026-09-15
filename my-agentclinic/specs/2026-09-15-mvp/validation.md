# MVP — Validation

How we know the MVP implementation has succeeded and can be merged back.

Status: **ALL GATES GREEN** (run 2026-09-15).

## Automatic gates

- [x] `npm run build` (strict `tsc`) completes with zero errors.
- [x] `npm test` (Vitest) passes, including API smoke tests in `tests/`
  for:
  - `/api/bookings`: create → list → get → reschedule (PATCH) →
    cancel → delete happy path; 400 on invalid payload; 404 on missing
    booking or unknown agent.
  - `/api/agents/:id/bookings`: list scoped to an agent; 404 on unknown
    agent.
  - Existing suites (agents, ailments, therapies, assignments, escapeHtml)
    still pass.
  - Dashboard pages render without horizontal overflow on a phone
    viewport (375 px) with all nav links visible; same check on desktop
    (1200 px) in the headless-browser navigation tests.

## Manual gates

- [x] Server starts cleanly with `npm run dev`.
- [x] Dashboard shows Agents, Ailments, Therapies, and Bookings pages;
  bookings appear with agent, human, time, and status.
- [x] Header nav lets you reach every section page (`/agents`, `/ailments`,
  `/therapies`, `/bookings`); clicking each link navigates there and the
  active link is highlighted.
- [x] Empty states are sensible for every section.
- [x] Layout stays responsive: new tables scroll inside `.table-wrap`
  on small screens; no horizontal page overflow (mobile overflow check
  is covered by the automated browser test).

## Spec sync

- [x] `specs/roadmap.md` updated: Phase 3 done; Phase 4 polish items done.
- [x] `specs/2026-09-15-mvp/plan.md` task groups marked done.
- [x] Feature docs reflect the implemented code (appointments entity,
  booking endpoints, dashboard sections, tests).
- [x] CHANGELOG.md updated on this branch before merging (newest date
  heading at top of the project root changelog).

## Merge readiness

- [x] Branch `mvp` cleanly rebased on its base.
- [x] `git diff` reviewed and limited to MVP scope.
- [x] No leftover debug output or secrets.
- [x] Build artifacts (`dist/`) and the runtime SQLite database
  (`data/agentclinic.db*`) are untracked via `.gitignore`.
- [x] All checks above green. — Merged into `main` (fast-forward).