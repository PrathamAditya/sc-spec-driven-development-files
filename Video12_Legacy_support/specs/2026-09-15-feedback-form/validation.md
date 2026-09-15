# Validation — Feedback Form (Phase 8)

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
- `feedback` table exists after migration with columns: `id`, `name`, `role`, `message`, `created_at`.
- The `role` `CHECK` constraint rejects a value outside `('agent', 'staff', 'visitor', 'other')`.
- Inserting feedback returns a row id; `SELECT ... ORDER BY created_at DESC` lists newest first.

### GET /feedback
- Returns HTTP 200 and HTML.
- Contains a form with `name="name"`, `name="role"`, `name="message"`.
- Role select includes agent/staff/visitor/other options.
- Page is rendered inside the shared layout (`<header>`, `<main>`, `<footer>`, single `<h1>`).

### POST /feedback
- Valid submission returns HTTP 302 redirect to `/feedback/thanks`.
- `GET /feedback/thanks` returns HTTP 200 and contains a success/thanks phrase.
- Missing `name`, `role`, or `message` returns HTTP 200 with the form re-rendered and the word "required" present.
- Message over 1000 chars (or name over 100) returns HTTP 200 with a size/length error.
- Role not in the allow-list returns HTTP 200 with an error.
- Message containing `<script>...</script>` is stored and rendered without script tags (HTML stripped).

### Staff visibility
- After a submit, `GET /dashboard` contains the submitted feedback message and role.

### Navigation
- Header/`/` includes a `Feedback` link pointing to `/feedback`.

---

## 3. Manual Smoke Test Checklist

Start the dev server (`npm run dev`) and verify each item in a browser.

- [ ] `/feedback` loads with the three fields and a playful, on-mission heading.
- [ ] Submitting with all valid fields redirects to `/feedback/thanks` and shows a confirmation message.
- [ ] Submitting with empty fields re-renders the form with inline error messages for each missing field.
- [ ] Submitting a role outside the list (if featured) shows an error.
- [ ] Pasting a long message (1000+ chars) shows a length error, not a crash.
- [ ] `POST` with `<script>` tags in the message shows them as plain text on the dashboard, not executed HTML.
- [ ] The dashboard lists recent feedback (name, role, message) for staff.
- [ ] The `Feedback` link appears in the header nav on all pages.
- [ ] At 375px viewport, the form, confirmation page, and dashboard feedback section stack cleanly with no horizontal scroll.
- [ ] Tab order on the form moves name → role → message → submit; inputs show a visible focus ring.
- [ ] No raw errors or stack traces on any feedback route.