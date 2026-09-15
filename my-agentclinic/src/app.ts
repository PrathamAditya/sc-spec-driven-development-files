import path from 'node:path'
import express from 'express'
import { db, runMigrations } from './db'
import { agentsRouter, AgentRow } from './agents'
import { ailmentsRouter, AilmentRow } from './ailments'
import { therapiesRouter, TherapyRow } from './therapies'
import { layout } from './components/Layout'
import { escapeHtml } from './components/Main'

runMigrations()

export const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use('/api/agents', agentsRouter)
app.use('/api/ailments', ailmentsRouter)
app.use('/api/therapies', therapiesRouter)

interface TherapyAssignment extends TherapyRow {
  agent_id: number
}

app.get('/', (_req, res) => {
  const agents = db.prepare('SELECT * FROM agents ORDER BY id').all() as AgentRow[]
  const ailments = db.prepare('SELECT * FROM ailments ORDER BY id').all() as AilmentRow[]
  const therapies = db.prepare('SELECT * FROM therapies ORDER BY id').all() as TherapyRow[]
  const assignments = db
    .prepare(
      `SELECT t.*, at.agent_id FROM therapies t
       JOIN agent_therapies at ON at.therapy_id = t.id
       ORDER BY at.agent_id, t.id`
    )
    .all() as TherapyAssignment[]

  const assignedFor = (agentId: number): string => {
    const names = assignments.filter((a) => a.agent_id === agentId).map((a) => escapeHtml(a.name))
    return names.length ? names.join(', ') : '<em>none</em>'
  }

  const agentRows = agents
    .map(
      (a) => `<tr>
  <td>${a.id}</td>
  <td>${escapeHtml(a.name)}</td>
  <td>${escapeHtml(a.species)}</td>
  <td>${assignedFor(a.id)}</td>
  <td>${a.created_at}</td>
</tr>`
    )
    .join('')

  const ailmentRows = ailments
    .map(
      (a) => `<tr>
  <td>${a.id}</td>
  <td>${escapeHtml(a.name)}</td>
  <td>${a.description ? escapeHtml(a.description) : '<em>—</em>'}</td>
  <td>${a.created_at}</td>
</tr>`
    )
    .join('')

  const therapyRows = therapies
    .map(
      (t) => `<tr>
  <td>${t.id}</td>
  <td>${escapeHtml(t.name)}</td>
  <td>${t.description ? escapeHtml(t.description) : '<em>—</em>'}</td>
  <td>${t.applies_to ? escapeHtml(t.applies_to) : '<em>—</em>'}</td>
  <td>${t.created_at}</td>
</tr>`
    )
    .join('')

  const section = (title: string, headers: string[], rows: string) => `<h2>${title}</h2>
<div class="table-wrap">
  <table>
    <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${rows === '' ? `<tr><td colspan="${headers.length}">No ${title.toLowerCase()} yet</td></tr>` : rows}</tbody>
  </table>
</div>`

  const body = `
${section('Agents', ['ID', 'Name', 'Species', 'Therapies', 'Created'], agentRows)}
${section('Ailments', ['ID', 'Name', 'Description', 'Created'], ailmentRows)}
${section('Therapies', ['ID', 'Name', 'Description', 'Applies to', 'Created'], therapyRows)}`

  res.set('Content-Type', 'text/html').send(layout({ title: 'Dashboard', body }))
})