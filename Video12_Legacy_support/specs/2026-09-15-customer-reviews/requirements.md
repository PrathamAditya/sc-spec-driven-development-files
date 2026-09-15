# Requirements — Customer Reviews (Phase 9)

## Context

Phase 9 of the roadmap (`specs/roadmap.md`) — "Customer Reviews". Phase 8 delivered the staff-only feedback form; this phase adds the public read-and-write path. Visitors leave starred reviews for the clinic's therapists, and everyone — Steve's public visitors, the agent patients, and Mary's staff — reads them on the homepage and on a dedicated `/reviews` page.

This feature follows the established patterns: server-side JSX components, a Hono router, a plain-SQL migration, prepared statements, seeded data, and Vitest coverage. See `specs/mission.md` and `specs/tech-stack.md` for the governing guidance (humor everywhere, all audiences equal, responsive mandatory, no new dependencies).

## Scope Decisions (confirmed via interview)

- **Placement**: both — a "Customer Reviews" section on the homepage **and** a dedicated `/reviews` page that lists every review.
- **Read visibility**: public. Reviews exist to convince visitors (Steve), so everyone sees them.
- **Submitters**: public visitors only. No role field — agents and staff already have the feedback form for internal commentary.
- **Moderation-lite**: **auto-approve**. Any validated submission is immediately visible; no moderation admin UI is built (roadmap item 9.4 resolved as "not needed").
- **Fields**: exactly three — `author`, `rating`, `body`. No email, no role, no optional extras.
- **Constraints**: `author` required, ≤ 100 chars; `rating` required integer 1–5 (rendered as stars); `body` required, 20–500 chars.
- **Success flow**: valid `POST /reviews` redirects (302) to `/reviews/thanks` (matching the feedback and appointment flows).
- **Nav**: review entry points live on the homepage section ("See all reviews" → `/reviews`, "Leave a review" → `/reviews/new`). No header nav change.
- **Empty state**: seeded reviews from day one; if a product state with zero reviews ever exists, read pages show a witty, mission-consistent empty-state message.

## Functional Requirements

### F1 — Data layer
- Migration `008_create_reviews.sql` creates a `reviews` table:
  - `id INTEGER PRIMARY KEY AUTOINCREMENT`
  - `author TEXT NOT NULL`
  - `rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5)`
  - `body TEXT NOT NULL`
  - `created_at TEXT NOT NULL DEFAULT (datetime('now'))`
- Seed several (5–6) playful, on-mission reviews in `src/db/seed.ts` using a fixed-id `INSERT OR IGNORE` prepare (matching existing seed style).
- DB helper types and prepared statements for inserting a review and selecting all reviews ordered by `created_at DESC` (newest first).

### F2 — Read path
- `GET /reviews` renders all reviews newest-first in the shared `Layout` as review cards showing author, star rating, body, and a created-at label.
- Homepage `/` renders a "Customer Reviews" section previewing the latest reviews (e.g. 3) with links to `/reviews` ("See all reviews") and `/reviews/new` ("Leave a review").
- The read queries select **all** rows — no unpublished state exists (auto-approve policy).

### F3 — Write path
- `GET /reviews/new` renders a server-side JSX form (`author` text input, `rating` select 1–5, `body` textarea) in the shared `Layout`, with `errors`/`values` props and `aria-describedby` wiring (matching `FeedbackForm`).
- `POST /reviews` parses the body, strips HTML (`<[^>]*>` pattern), trims, coerces `rating` to an integer, and validates:
  - `author` required, ≤ 100 chars
  - `rating` required, integer 1–5
  - `body` required, ≥ 20 and ≤ 500 chars
- On success: inserts a row and redirects (302) to `/reviews/thanks`.
- On validation failure: 200 with the re-rendered form, preserved values, and inline error messages.

### F4 — Confirmation page
- `GET /reviews/thanks` renders a playful confirmation page ("Your review has been lodged with the… humans? agents? both?") in the shared `Layout`.

### F5 — Navigation & placement
- Homepage review section links to `/reviews` and `/reviews/new`.
- `/reviews` page links to `/reviews/new` so a reader can become a reviewer.

### F6 — Responsive & accessibility
- Review cards and the form follow the mobile-first CSS pattern; no horizontal scroll at 375px.
- Star rating is readable without a screen reader (numeric rating text such as "5/5" rendered alongside stars).
- Labels wrap inputs; errors use `aria-describedby`; focus styles visible (existing patterns).

## Non-Functional Requirements

- **Stack constraints** (`specs/tech-stack.md`): no new dependencies, no external services (no star-widget or review embeds), server-rendered only, plain SQL migrations, Vitest.
- **Security**: all inputs sanitized (HTML stripped, trimmed); `rating` parsed as a strict integer and range-checked; DB `CHECK` constraint enforces 1–5 at the database level; all writes via prepared statements.
- **Type safety**: full TypeScript strict pass (`npm run typecheck`).
- **Testability**: all routes testable via Hono `app.request` against an in-memory DB (existing `tests/app.test.tsx` pattern).
- **Idempotency**: migration follows the existing `_migrations` runner; seeding uses `INSERT OR IGNORE` so re-runs are safe.

## Out of Scope

- Editing, deleting, approving, or rejecting reviews (auto-approve policy; moderation-lite deferred).
- Rate limiting / CAPTCHA / spam protection (deferred — no external deps).
- Sorting or filtering by rating or author (newest-first only).
- Review replies, markup formatting, or rich text.
- Client-side JS star widgets or live-preview.
- Header-nav changes (reviews are reached from the homepage section).

## Context

See `specs/2026-09-15-feedback-form/` for the closest prior feature (Phase 8) — same form patterns, sanitization, and validation style. See `specs/2026-04-06-mvp/` for the base patterns and `specs/roadmap.md` Phase 9 for the task list this document expands. Governing guidance comes from `specs/mission.md` and `specs/tech-stack.md`.