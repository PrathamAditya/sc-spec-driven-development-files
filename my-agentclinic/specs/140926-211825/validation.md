# AgentClinic — Validation

How we know each implementation phase has succeeded and can be merged.

## Automatic gates

- [ ] `npm run build` (strict `tsc`) completes with zero errors.
- [ ] Server starts cleanly with `npm run dev`.
- [ ] API smoke tests pass for the phase's endpoints:
  - happy path (create → list → get → update → delete).
  - error path (400 on invalid input, 404 on missing resources).

## Manual gates

- [ ] Dashboard pages render correctly in a modern browser.
- [ ] Header, main, and footer layout render with `public/styles.css` applied.
- [ ] Empty states are sensible (e.g. "No agents yet").
- [ ] Data persists across server restarts (SQLite file grows as expected).

## Spec sync

- [ ] `specs/roadmap.md` and any active plan (in the specs directory)
  reflect what was actually implemented.
- [ ] No unexplained drift between `specs/tech-stack.md` and the code
  (libraries, structure, style approach).

## Merge readiness

- [ ] No leftover debug output or secrets in the diff.
- [ ] `git diff` reviewed and limited to the phase's scope.
- [ ] All checks above green. Only then merge.