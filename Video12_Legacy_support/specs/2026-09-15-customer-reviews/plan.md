# Plan — Customer Reviews (Phase 9)

Numbered task groups in implementation order. Each group is independently reviewable and testable; each maps to roadmap items 9.1–9.5.

---

## Group 1 — Data Layer (9.1)
1. Create `src/db/migrations/008_create_reviews.sql` — `reviews` table (`id`, `author`, `rating` with `CHECK (rating >= 1 AND rating <= 5)`, `body`, `created_at`), following the `007_create_feedback.sql` style.
2. Add `Review` interface to `src/db/types.ts` (`id`, `author`, `rating`, `body`, `created_at`).
3. Add seed reviews to `src/db/seed.ts` — a `seedReviews`-style list of 5–6 playful, on-mission visitor reviews and a fixed-id `INSERT OR IGNORE` prepare (add to the existing `seed(db)` after `insertAppointment`), mirroring the other seed blocks.
4. Prepare statements in `src/routes/reviews.tsx`: `insertReview` and `selectReviews` (`SELECT ... ORDER BY created_at DESC, id DESC`), mirroring how `src/routes/feedback.tsx` prepares its insert.

## Group 2 — Read Path (9.2)
5. Create `src/components/ReviewsList.tsx` — a review-card list component (author, star rating rendered as stars **plus** numeric text like "5/5" for accessibility, body, created-at label), taking `reviews: Review[]` and reusing existing CSS design-system tokens.
6. Create `src/routes/reviews.tsx` Hono router with `GET /reviews`, rendering `<ReviewsList>` in the shared `Layout` for all rows from `selectReviews`.
7. Update `src/pages/Home.tsx` and `src/app.tsx`'s `/` handler — pass the 3 latest reviews into `Home` and render a "Customer Reviews" preview section with links to `/reviews` ("See all reviews") and `/reviews/new` ("Leave a review").

## Group 3 — Write Path (9.3, 9.4)
8. Create `src/components/ReviewForm.tsx` — server-side JSX form (`author` text input, `rating` select with options 1–5, `body` textarea) in the shared `Layout`, with `errors` and `values` props and `aria-describedby` wiring, matching `FeedbackForm.tsx`.
9. Create `src/components/ReviewConfirmation.tsx` — playful confirmation page in the shared `Layout`.
10. Extend `src/routes/reviews.tsx` with the write path:
    - `GET /reviews/new` renders `ReviewForm`.
    - `POST /reviews` validates (author required ≤ 100; rating required, integer 1–5; body required, min 20, max 500), returns 200 + re-rendered `ReviewForm` on failure, otherwise inserts via `insertReview` and 302-redirects to `/reviews/thanks`.
    - `GET /reviews/thanks` renders `ReviewConfirmation`.
    - 9.4 moderation-lite: policy checkpoint only — no status column, no filters; the read queries in Group 2 already select every row. Document the auto-approve decision in the spec (this plan); no code gate required.

## Group 4 — Wire-Up
11. Register `reviewsRouter(db)` in `src/app.tsx` (`app.route("/reviews", ...)`).
12. Confirm the homepage section links resolve (`/reviews`, `/reviews/new`) and that `/reviews` links to `/reviews/new`.

## Group 5 — Tests (9.2, 9.3)
13. Add `tests/reviews.test.tsx` (mirroring `tests/feedback.test.tsx` / `tests/app.test.tsx` structure):
    - `GET /reviews` → 200, contains a seeded author, rating text, and body.
    - `/` → contains a "Customer Reviews" section, a seeded review preview, and links to `/reviews` and `/reviews/new`.
    - `GET /reviews/new` → 200, form with `name="author"`, `name="rating"`, `name="body"`; rating select includes 1–5.
    - `POST /reviews` valid → 302 to `/reviews/thanks`; `GET /reviews/thanks` → 200 with a success phrase; the submitted review appears on `GET /reviews`.
    - `POST /reviews` missing `author`/`rating`/`body` → 200 with "required" errors and preserved values.
    - `POST /reviews` rating `0`, `6`, or non-numeric → 200 with a rating error.
    - `POST /reviews` body under 20 chars → 200 with a min-length error; over 500 chars → 200 with a length error; `author` over 100 chars → 200 with a length error.
    - `POST /reviews` with `<script>...</script>` in author/body → stored and rendered without script tags.
    - Empty state: with `reviews` cleared, `GET /reviews` and `/` show a witty empty-state message rather than a crash.
    - Unknown subroute (e.g. `GET /reviews/nope`) → 404 page.

## Group 6 — Responsive & Merge Pass (9.5)
14. Style review cards consistent with the design system (reuse CSS custom properties); verify homepage section, `/reviews`, `/reviews/new`, and the confirmation page at 375px and 1280px with no horizontal scroll.
15. Confirm keyboard flow on the form (author → rating → body → submit) with a visible focus ring, and that star ratings are readable without a screen reader.
16. Run `npm run typecheck` and `npm test`; both must pass clean before merge.

---

## Definition of Done
All Group 1–5 tasks complete and reviewed, Group 6 checks pass, feature branch `feature/customer-reviews` ready to merge into `main`/`mvp` per project flow, and roadmap Phase 9 items ticked after merge.