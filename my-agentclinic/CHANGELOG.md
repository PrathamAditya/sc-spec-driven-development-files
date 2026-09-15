# Changelog

## 2026-09-15
- fix: Bookings dashboard lists upcoming (future) bookings before past ones on the `/bookings` page (`sortUpcomingFirst`)
- test: Add phone-viewport (375 px) automated checks across all pages — no horizontal overflow and all nav links visible (in `tests/navigation.test.ts`); responsive gate is now machine-verified on mobile + desktop
- docs: Clarify the scoped bookings endpoint (`/api/agents/:id/bookings` is a list-only route; full CRUD lives at `/api/bookings`) in `specs/roadmap.md`, `specs/2026-09-15-mvp/requirements.md`, and `specs/140926-211825/plan.md`
- docs: Drop the stale "ailments linked to agents" claim in `specs/140926-211825/requirements.md`; only therapies link to agents (matches the feature spec + code)
- chore: Stop tracking build output (`dist/`) and the runtime SQLite database (`data/agentclinic.db*`); added to `.gitignore`
- fix: Dashboard navigation — header links now point to real section pages (`/agents`, `/ailments`, `/therapies`, `/bookings`) with active-link state, so Agents/Ailments/Therapies/Bookings navigation works reliably in the browser (previously a single-page anchor layout, which could not scroll into view on short pages); `/` remains the all-sections overview
- test: Add section-page tests (`tests/pages.test.ts`) and rewrite the browser navigation test (`tests/navigation.test.ts`) to click through every nav link and verify navigation + destination heading (63 tests total, 63 passing)
- feat: MVP — Bookings feature (appointments entity, `/api/bookings` + `/api/agents/:id/bookings` CRUD, reschedule/cancel, Bookings dashboard section, header nav) and MVP polish (navigation, empty states, responsive verification)
- test: Add Vitest API smoke tests for bookings (46 tests total across the suite) and a complete demo journey (agent → ailment → therapy → assignment → booking)
- feat: Ailments & Therapies feature — ailments and therapies entities, CRUD APIs (`/api/ailments`, `/api/therapies`), agent–therapy assignments (`/api/agents/:id/therapies`), dashboard sections, and Vitest API smoke tests in `tests/`
- test: Add API smoke tests for ailments, therapies, and agent–therapy assignments (31 tests total, using an exported `app` + in-memory SQLite)
- refactor: Extract testable `app.ts`; make SQLite path configurable via `AGENTCLINIC_DB`
- refactor: Merge roadmap phases 2 and 3; update implementation plan for Agents, Ailments & Therapies
- feat: Responsive design — mobile-first CSS media queries, scrollable tables
- test: Add Vitest tests for escapeHtml and testing tooling
- feat: Add Vitest test support and initial tests

## 2026-09-14
- docs: Add implementation plan, requirements, and validation documents

## 2026-09-08
- feat: First app loop — Express 5 + TypeScript scaffold with SQLite
- chore: Add project constitution (mission, tech-stack, roadmap)

## History carried over from course repo
- 2026-06-01: README polish and DeepLearning.AI resource links
- 2026-04-20: Lesson folder renames; README mirroring (Lesson_04/Lesson_05)
- 2026-04-16: Add prompts to all lessons
- 2026-04-14: Unpack changelog skill into lessons; add generic feature-spec skill; git prerequisites; .gitignore
- 2026-04-13: Course lesson folders, skills, example specs, and README