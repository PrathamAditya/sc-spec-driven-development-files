# Validation — Customer Reviews (Phase 9)

The feature is ready to merge when all three criteria below pass.

---

## 1. TypeScript Compiles Clean

```
npm run typecheck
```

Must exit with code 0 and no errors or warnings.

---

## 2. Vitest Unit Tests

Run with:

```
npm test
```

All tests must pass. Required coverage:

### Data layer
- `reviews` table exists after migration with columns: `id`, `author`, `rating`, `body`, `created_at`.
- The `rating` `CHECK` constraint rejects values outside 1–5 (e.g. `0`, `6`).
- Seeding inserts the expected reviews; `SELECT ... ORDER BY created_at DESC, id DESC` lists newest first.

### GET /reviews
- Returns HTTP 200 and HTML.
- Contains a seeded review author, rating text, and body.
- Page is rendered inside the shared layout (`<header>`, `<main>`, `<footer>`, single `<h1>`).
- Reviews render newest-first.

### Homepage read path
- `/` contains a "Customer Reviews" section, at least one seeded review preview, and links to `/reviews` ("See all reviews") and `/reviews/new` ("Leave a review").

### GET /reviews/new
- Returns HTTP 200 and HTML.
- Contains a form with `name="author"`, `name="rating"`, `name="body"`.
- Rating select includes options `1` through `5`.

### POST /reviews
- Valid submission returns HTTP 302 redirect to `/reviews/thanks`.
- `GET /reviews/thanks` returns HTTP 200 and contains a success/thanks phrase.
- After submit, the new review appears on `GET /reviews`.
- Missing `author`, `rating`, or `body` returns HTTP 200 with the form re-rendered and the word "required" present, with values preserved.
- Rating `0`, `6`, or non-numeric (`"abc"`) returns HTTP 200 with a rating error.
- Body under 20 chars returns HTTP 200 with a min-length error; body over 500 chars returns HTTP 200 with a length error.
- Author over 100 chars returns HTTP 200 with a length error.
- Author/body containing `<script>...</script>` is stored and rendered without script tags (HTML stripped).

### Empty state
- With the `reviews` table cleared, `GET /reviews` and `/` return HTTP 200 with a witty empty-state message (and no stack trace).

### 404 handling
- Unknown reviews subroute (e.g. `GET /reviews/nope`) returns HTTP 404, not 500.

---

## 3. Manual Smoke Test Checklist

Start the dev server (`npm run dev`) and verify each item in a browser.

- [ ] Homepage shows a "Customer Reviews" section with several seeded reviews and a "See all reviews" link.
- [ ] "See all reviews" opens `/reviews` listing all reviews newest-first.
- [ ] "Leave a review" opens `/reviews/new` with author, rating, and body fields.
- [ ] Submitting with all valid fields redirects to `/reviews/thanks` and shows a playful confirmation message.
- [ ] Submitting with empty fields re-renders the form with inline errors for each missing field.
- [ ] Choosing rating `0`/`6` (if presented) or entering a non-rating shows a rating error.
- [ ] Entering a body under 20 chars shows a min-length error, not a crash.
- [ ] Pasting `<script>` tags into author or body shows them as plain text on `/reviews`, not executed HTML.
- [ ] After submitting, the new review appears on `/reviews` and in the homepage section.
- [ ] Star ratings are readable (numeric text such as "5/5" present) without a screen reader.
- [ ] At 375px viewport, the homepage section, `/reviews`, the form, and the confirmation page stack cleanly with no horizontal scroll.
- [ ] Tab order on the form moves author → rating → body → submit; inputs show a visible focus ring.
- [ ] No raw errors or stack traces on any reviews route.