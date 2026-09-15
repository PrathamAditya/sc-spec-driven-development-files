# Plan — Feedback Form (Phase 8)

Numbered task groups in implementation order. Each group is independently reviewable and testable; each maps to roadmap items 8.1–8.5.

---

## Group 1 — Data Layer
1. Create `src/db/migrations/007_create_feedback.sql` — `feedback` table (id, name, role with `CHECK` allow-list, message, created_at), following the `appointments` migration style.
2. Add `Feedback` interface to `src/db/types.ts` (id, name, role, message, created_at).
3. Add prepared-statement helpers (insert + select-all ordered by `created_at DESC`) for feedback, mirroring how `src/routes/appointments.tsx` prepares statements.

## Group 2 — Feedback Form Page
4. Create `src/components/FeedbackForm.tsx` — server-side JSX form (name text input, role select with agent/staff/visitor/other, message textarea) in the shared `Layout`, with `errors` and `values` props and `aria-describedby` wiring, matching `AppointmentForm.tsx`.
5. Create `src/components/FeedbackConfirmation.tsx` — playful confirmation page in the shared `Layout`.
6. Create `src/routes/feedback.tsx` — Hono router using the shared `stripHtml`-style sanitization:
   - `GET /feedback` renders `FeedbackForm`.
   - `POST /feedback` validates (all required, caps: name ≤ 100, role ≤ 32, message ≤ 1000, role in allow-list), returns 200 + re-rendered form on failure, otherwise inserts + 302 redirect to `/feedback/thanks`.
   - `GET /feedback/thanks` renders `FeedbackConfirmation`.

## Group 3 — Wire-Up
7. Register `feedbackRouter(db)` in `src/app.tsx` (`app.route("/feedback", ...)`).
8. Add a `Feedback` link to `src/components/Header.tsx` nav.
9. Surface recent feedback on the dashboard: extend `src/routes/dashboard.tsx` to query the latest feedback rows and pass them to `Dashboard`; extend `src/components/Dashboard.tsx` to render a "Recent Feedback" list for staff.

## Group 4 — Tests
10. Extend `tests/app.test.tsx` (or add `tests/feedback.test.tsx`) with:
    - `GET /feedback` → 200, contains form + `name="name"`, `name="role"`, `name="message"`.
    - `POST /feedback` valid → 302 to `/feedback/thanks`; confirmation contains a success phrase.
    - `POST /feedback` missing fields → 200 with inline "required" errors.
    - `POST /feedback` with `<script>` tags in message → sanitized (no `<script>` in confirmation or stored value).
    - `POST /feedback` with role not in allow-list → 200 with error.
    - `GET /dashboard` → contains recent feedback message.
    - New nav link `Feedback` present on `/` (or header components test).

## Group 5 — Responsive & Merge Pass
11. Verify form, confirmation, and dashboard feedback section at 375px and 1280px (mobile-first CSS, no horizontal scroll).
12. Confirm keyboard flow: Tab order sensible, visible focus ring on inputs/select/button.
13. Run `npm run typecheck` and `npm test`; both must pass clean before merge.

---

## Definition of Done
All Group 1–4 tasks complete and reviewed, Group 5 checks pass, feature branch ready to merge into `main`/`mvp` per project flow.