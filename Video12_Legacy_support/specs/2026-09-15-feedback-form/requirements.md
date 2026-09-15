# Requirements — Feedback Form (Phase 8)

## Context

Phase 8 of the roadmap addresses the top item in `TODO.md` ("NOW — Feedback form"). AgentClinic is a real product with humor everywhere and equal treatment of visitors, agents, and staff. The form gives visitors and agents a way to tell the clinic how it's doing — and gives staff (Mary) a place to read those comments.

This feature follows the established patterns: server-side JSX components, a Hono router, a plain-SQL migration, prepared statements, and Vitest coverage. See `specs/mission.md` and `specs/tech-stack.md` for the governing guidance.

## Scope Decisions (confirmed via interview)

- **Fields**: exactly three — `name`, `role`, `message`. No email, no rating.
- **Visibility**: feedback is **staff-only**, surfaced on the `/dashboard` page. Visitors never see submitted feedback.
- **Placement**: a dedicated `GET /feedback` page linked from the header navigation.
- **Required fields**: all three required. Missing input re-renders the form with inline errors (matching the appointment form pattern).
- **Validation**: length caps plus HTML stripping and trimming. Roles restricted to a small allow-list.
- **Success flow**: on valid submission, `POST /feedback` redirects to a confirmation page (matching the appointment booking flow).
- **Tone**: playful, mission-consistent copy ("where AI agents come to get better"), humor in labels and confirmation copy.

## Functional Requirements

### F1 — Data layer
- Migration `007_create_feedback.sql` creates a `feedback` table:
  - `id INTEGER PRIMARY KEY AUTOINCREMENT`
  - `name TEXT NOT NULL`
  - `role TEXT NOT NULL` with `CHECK (role IN ('agent', 'staff', 'visitor', 'other'))`
  - `message TEXT NOT NULL`
  - `created_at TEXT NOT NULL DEFAULT (datetime('now'))`
- DB helper types and prepared statements for inserting feedback and listing all feedback (newest first).

### F2 — Display page
- `GET /feedback` renders a server-side JSX form with fields `name`, `role`, `message`, in the shared `Layout`.
- Role rendered as a select with options: agent, staff, visitor, other.
- Form re-renders with preserved values and inline error messages on validation failure (matches `AppointmentForm` behavior).

### F3 — Submission
- `POST /feedback` parses the body, trims, strips HTML (`<[^>]*>` pattern), enforces length caps, validates the role allow-list.
- Length caps (HK1): `name` ≤ 100 chars, `role` ≤ 32 chars, `message` ≤ 1000 chars, or validation fails.
- On success: inserts a row and redirects (302) to `/feedback/thanks` (confirmation page).
- On validation failure: 200 with the re-rendered form and `aria-describedby` error messages.

### F4 — Confirmation page
- `GET /feedback/thanks` renders a playful confirmation page (e.g., "Thanks! The humans have been notified and mildly embarrassed.") in the shared layout.

### F5 — Staff visibility
- `/dashboard` lists recent feedback entries (name, role, message, created_at) so Mary can read them.
- Dashboard summary count is not required to change.

### F6 — Navigation
- Header nav gains a `Feedback` link to `/feedback`.

### F7 — Responsive & accessibility
- Form, confirmation, and dashboard feedback list follow the mobile-first CSS pattern; no horizontal scroll at 375px.
- Labels wrap inputs; errors use `aria-describedby`; focus styles visible (existing patterns).

## Non-Functional Requirements

- **Stack constraints** (`specs/tech-stack.md`): no new dependencies, no external services, server-rendered only.
- **Security**: all inputs sanitized (HTML stripped, trimmed); all DB writes via prepared statements; `CHECK` constraint enforces roles at the DB level.
- **Type safety**: full TypeScript strict pass (`npm run typecheck`).
- **Testability**: all routes testable via Hono `app.request` against an in-memory DB (existing Vitest pattern).
- **Idempotency**: migration follows the existing `_migrations` runner; no duplicate seeding concerns (feedback is write-only here).

## Out of Scope

- Editing, deleting, or approving feedback.
- Rate limiting / CAPTCHA / spam protection (explicitly deferred — no external deps).
- Email/contact fields or reply flows.
- Public display of feedback (this is Phase 9, customer reviews, territory).

## Context

See `specs/2026-04-06-mvp/` for the patterns and `specs/roadmap.md` Phase 8 for the task list this document expands.