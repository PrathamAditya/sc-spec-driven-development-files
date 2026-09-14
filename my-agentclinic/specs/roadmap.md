# AgentClinic — Roadmap

High-level implementation order in small phases of work.

- **Phase 1 — Scaffold.** Set up the TypeScript + Express project,
  build step, dev server, and SQLite connection. — **Done**
- **Phase 2 — Agents.** Data model and CRUD for agents; agent listing
  in the dashboard. REST API at `/api/agents` (list, get, create, patch,
  delete) with validation; dashboard at `/` rendered via the
  Header/Main/Footer/Layout components and `public/styles.css`. — **Done**
- **Phase 3 — Ailments & Therapies.** Data model and CRUD for ailments
  and therapies; link agents to their therapies.
- **Phase 4 — Bookings.** Appointment scheduling between agents and
  humans; view and manage bookings.
- **Phase 5 — Polish.** Attractive, modern-browser-friendly UI; dashboard
  for agents and staff; reliability and cleanup.