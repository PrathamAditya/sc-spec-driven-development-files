# AgentClinic — Roadmap

High-level implementation order in small phases of work.

- **Phase 1 — Scaffold.** Set up the TypeScript + Express project,
  build step, dev server, and SQLite connection. — **Done**
- **Phase 2 — Agents, Ailments & Therapies.** Data model and CRUD for
  agents, ailments, and therapies; link agents to their therapies.
  Agents done: REST API at `/api/agents` (list, get, create, patch,
  delete) with validation; dashboard at `/` rendered via the
  Header/Main/Footer/Layout components and `public/styles.css`;
  responsive layout (mobile-first media queries, horizontally
  scrollable table). Ailments & therapies in progress.
- **Phase 3 — Bookings.** Appointment scheduling between agents and
  humans; view and manage bookings.
- **Phase 4 — Polish.** Attractive, modern-browser-friendly UI; dashboard
  for agents and staff; responsive design verification across
  phone/tablet/desktop; reliability and cleanup.