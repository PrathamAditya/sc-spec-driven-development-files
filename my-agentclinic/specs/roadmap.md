# AgentClinic — Roadmap

High-level implementation order in small phases of work.

- **Phase 1 — Scaffold.** Set up the TypeScript + Express project,
  build step, dev server, and SQLite connection. — **Done**
- **Phase 2 — Agents, Ailments & Therapies.** Data model and CRUD for
  agents, ailments, and therapies; link agents to their therapies. — **Done**
  Agents: REST API at `/api/agents` (list, get, create, patch, delete)
  with validation; dashboard at `/` rendered via the
  Header/Main/Footer/Layout components and `public/styles.css`;
  responsive layout (mobile-first media queries, horizontally
  scrollable table). Ailments & therapies: REST APIs at `/api/ailments`
  and `/api/therapies` (full CRUD), agent–therapy assignments at
  `/api/agents/:id/therapies` (list, assign, remove), and dashboard
  sections for all three with Vitest API smoke tests in `tests/`.
- **Phase 3 — Bookings.** Appointment scheduling between agents and
  humans; view and manage bookings. — **Done**
  REST API at `/api/bookings` (create, list, get, reschedule, cancel,
  delete) plus a scoped bookings list at `/api/agents/:id/bookings`,
  following the 400/404/204 conventions; appointments table with FK +
  status enum; section pages (`/agents`, `/ailments`, `/therapies`,
  `/bookings`) with header navigation; Vitest API smoke tests.
- **Phase 4 — Polish.** Attractive, modern-browser-friendly UI; dashboard
  for agents and staff; responsive design verification across
  phone/tablet/desktop; reliability and cleanup. — **MVP essentials done**
  Header navigation linking to real section pages with active state,
  empty states, and responsive layout verified via automated page and
  browser navigation tests. (MVP == Phases 1–3 + Phase 4 essentials.)