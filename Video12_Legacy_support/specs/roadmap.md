# Roadmap

Phases are intentionally focused — each one is a shippable slice of work, independently reviewable and testable. Completed phases stay for reference; working items are broken into the smallest useful steps.

---

## Phase 1 — Hello Hono ✅
- Install and configure Hono with `tsx` dev server
- Single `/` route returning "AgentClinic is open for business"
- Confirm TypeScript types work end-to-end

## Phase 2 — Agents & Ailments ✅
- Server-side JSX layout component (header, nav, main, footer)
- Basic CSS (custom properties, reset, typography)
- All routes render inside the shared layout
- SQLite database + first migration (`agents` table)
- Seed a handful of fictional agents
- `/agents` page listing all agents
- `/agents/:id` page showing a single agent's profile (name, model type, current status, presenting complaints)
- `ailments` table + seed data (e.g., "context-window claustrophobia", "prompt fatigue")
- `/ailments` list page
- Link agents to one or more ailments

## Phase 3 — Therapies Catalog ✅
- `therapies` table + seed data
- `/therapies` list page
- Map ailments → recommended therapies

## Phase 4 — Appointment Booking ✅
- `appointments` table (agent, therapist, datetime, status)
- Form to book an appointment from an agent's detail page
- Basic validation and confirmation page

## Phase 5 — Staff Dashboard ✅
- `/dashboard` with summary counts: agents, open appointments, ailments in-flight
- Simple table views for staff to manage records
- Mary's dashboard is now real

## Phase 6 — Polish & Accessibility ✅
- Responsive layout audit across all pages (mobile-first foundation established in Phase 1)
- Semantic HTML audit
- Keyboard navigation and focus styles

## Phase 7 — Hardening ✅
- Error pages (404, 500)
- Input sanitization on all forms
- Basic logging middleware

---

## Phase 8 — Feedback Form (NOW)

8.1 — Data layer: `feedback` migration (id, name, role, message, created_at) + DB helpers + tests
8.2 — Static page: `/feedback` form (name, role, message) rendered in the shared layout with tests
8.3 — POST handler: server-side validation (required fields, length caps), sanitized persistence to SQLite
8.4 — Confirmation flow: success state after submit (inline or confirmation page) with tests
8.5 — Link the form from the header/nav and verify responsive layout

## Phase 9 — Customer Reviews (Next)

9.1 — Data layer: `reviews` migration (id, author, rating, body, created_at) + seed reviews + DB helpers + tests
9.2 — Read path: render reviews (homepage section and/or `/reviews`) with tests
9.3 — Write path: `reviews` form with server-side validation and sanitization + tests
9.4 — Moderation-lite: review visibility rules (e.g., only approved/validated entries shown) if needed
9.5 — Style pass: review cards consistent with the rest of the design system

## Phase 10 — About Us Page (Next)

10.1 — Static page: `/about` with mission copy and physical address rendered in the shared layout
10.2 — Map: self-contained stylized map (no external maps API) built with HTML/CSS, with tests
10.3 — Navigation: wire About into the header/nav; ensure all audiences can reach it
10.4 — Responsive audit for `/about` across breakpoints (part of the general mobile-first pass)

## Phase 11 — Hardening Across New Pages

11.1 — Re-run semantic HTML and keyboard-navigation audit on all new pages (feedback, reviews, about)
11.2 — Re-run input sanitization review on the two new forms (feedback, reviews)
11.3 — Any remaining 404/500 handling on new routes
11.4 — Full `npm test` and `npm run typecheck` pass before merge

---

Later phases (not yet planned): auth, email notifications, therapist profiles, reporting.