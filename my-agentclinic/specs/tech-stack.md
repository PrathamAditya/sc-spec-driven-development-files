# AgentClinic — Tech Stack

- **Language:** TypeScript (strict mode)
- **Runtime:** Node.js 22
- **Server framework:** Express 5
- **Database:** SQLite via `better-sqlite3`, WAL mode, foreign keys enabled
- **UI style:** server-rendered HTML built from components
  (`src/components/` — Header, Main, Footer, Layout); styled by `public/styles.css`
  served via `express.static`; works in a modern browser
- **Responsive design:** responsive, mobile-first layout using flexible
  containers and CSS media queries; wide tables scroll horizontally in
  a `.table-wrap` container instead of breaking the page
- **Dev tooling:** `tsc` for build, `tsx watch` for the dev server
- **Testing:** Vitest for validation (unit + API smoke tests)