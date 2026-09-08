import path from 'node:path'
import express from 'express'
import { db, runMigrations } from './db'
import { agentsRouter, AgentRow } from './agents'
import { layout } from './components/Layout'
import { escapeHtml } from './components/Main'

runMigrations()

const app = express()
const PORT = Number(process.env.PORT ?? 3000)

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use('/api/agents', agentsRouter)

app.get('/', (_req, res) => {
  const agents = db.prepare('SELECT * FROM agents ORDER BY id').all() as AgentRow[]
  const rows = agents
    .map(
      (a) => `<tr>
  <td>${a.id}</td>
  <td>${escapeHtml(a.name)}</td>
  <td>${escapeHtml(a.species)}</td>
  <td>${a.created_at}</td>
</tr>`
    )
    .join('')
  const table = `<h1>Agents</h1>
<table>
  <thead><tr><th>ID</th><th>Name</th><th>Species</th><th>Created</th></tr></thead>
  <tbody>${rows === '' ? '<tr><td colspan="4">No agents yet</td></tr>' : rows}</tbody>
</table>`
  res.set('Content-Type', 'text/html').send(layout({ title: 'Agents', body: table }))
})

app.listen(PORT, () => {
  console.log(`AgentClinic listening on http://localhost:${PORT}`)
})