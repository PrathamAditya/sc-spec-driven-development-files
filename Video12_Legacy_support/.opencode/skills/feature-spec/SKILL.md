---
name: feature-spec
description: Generate the feature specification bundle (requirements.md, plan.md, validation.md) for AgentClinic's next roadmap phase. Use when the user says "feature spec", "write the spec", "start the next phase", "implement phase X", or asks to create a specs/YYYY-MM-DD-<feature> folder. Adheres to specs/mission.md and specs/tech-stack.md.
---

# Feature Spec Workflow

Create the next feature spec for the AgentClinic project. Follow these steps in order. Do not write any doc files until the interview in step 2 is complete.

## 1. Identify the next phase and create a branch

- Read `specs/roadmap.md` and find the first phase **without** a ✅ marker (the current work item).
- Create a git branch for it from the current branch, named `feature/<kebab-case-phase-name>` (e.g. `feature/feedback-form`). Use `git checkout -b`.
- Branch name should describe the phase, not the date.

## 2. Interview the user (required)

Before generating any documentation, ask clarifying questions with the `question` tool. Use the multiplexer/grouped format and confirm the answers before writing. Cover at least these three topics, mapped from the mission and stack docs:

- **Scope** — what the feature actually includes/excludes; who sees it (public vs staff-only); where it lives in the site structure.
- **Edge cases** — required vs optional fields, input validation/sanitization strictness, length caps, allow-list values, empty states.
- **User expectations** — success flow (inline vs redirect-to-confirmation, matching the existing appointment flow), tone (per `specs/mission.md`, humor is mandatory), accessibility/responsive expectations.

Take the user's answers and lock them in as explicit "Scope Decisions" in the docs.

## 3. Create the spec directory

- Create `specs/YYYY-MM-DD-<feature-name>/` — use **today's date** (`date +%F`) and the kebab-case feature name of the phase (e.g. `2026-09-15-feedback-form`).
- Inside it, write exactly three files, always in this order:

### requirements.md
Sections:
- `## Context` — why this phase exists, what the roadmap says, governing guidance.
- `## Scope Decisions (confirmed via interview)` — bullet list of the interview answers.
- `## Functional Requirements` — numbered `F1, F2, ...` with concrete behaviors, routes, DB schema, and components.
- `## Non-Functional Requirements` — stack constraints, security, type safety, testability, idempotency.
- `## Out of Scope` — what is explicitly deferred.
- `## Context` — links to mission.md, tech-stack.md, any prior feature spec folders.

### plan.md
- "Numbered task groups in implementation order" — each group maps to one roadmap checklist item and is independently reviewable/testable.
- Groups should be small, e.g. data layer → components/routes → wire-up → tests → responsive/merge pass.
- Number individual steps within groups (1., 2., 3., …).
- End with `## Definition of Done`.

### validation.md
Sections — all must pass before merge:
- `## 1. TypeScript Compiles Clean` — `npm run typecheck`, exit 0.
- `## 2. Vitest Unit Tests` — `npm test`; enumerate required coverage per area (GET routes, POST validation, sanitization, DB schema/constraints, nav links, staff visibility).
- `## 3. Manual Smoke Test Checklist` — `npm run dev`; checkbox list covering form behavior, sanitization, responsive pass at 375px, keyboard/focus flow, no stack traces.

## 4. Adherence rules

- Follow `specs/mission.md` (tone = humor everywhere, all audiences equal, responsive is mandatory) and `specs/tech-stack.md` (no new dependencies, no external services, server-side rendering, plain SQL migrations, Vitest).
- Match the file structure and voice of existing feature specs under `specs/<date>-<feature>/`.
- Do not implement the feature — this skill only produces the spec bundle and the branch. Remind the user to approve the spec and ask "Implement the plan?" to start implementation.

## Verification

- Confirm the branch exists (`git branch --show-current`).
- Confirm exactly three files exist in the new `specs/YYYY-MM-DD-<feature-name>/` folder.