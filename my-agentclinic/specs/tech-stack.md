# AgentClinic — Tech Stack

- **Language:** TypeScript (strict mode)
- **Runtime:** Node.js 22
- **Server framework:** Express 5
- **Database:** SQLite via `better-sqlite3`, WAL mode, foreign keys enabled
- **UI style:** server-rendered HTML built from components
  (`src/components/` — Header, Main, Footer, Layout); styled by `public/styles.css`
  served via `express.static`; works in a modern browser
- **Dev tooling:** `tsc` for build, `tsx watch` for the dev server