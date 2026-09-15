import path from 'node:path'
import express from 'express'
import { db, runMigrations } from './db'
import { agentsRouter, AgentRow } from './agents'
import { ailmentsRouter, AilmentRow } from './ailments'
import { therapiesRouter, TherapyRow } from './therapies'
import { bookingsRouter, AppointmentRow } from './bookings'
import { layout } from './components/Layout'
import { escapeHtml } from './components/Main'

runMigrations()

export const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use('/api/agents', agentsRouter)
app.use('/api/ailments', ailmentsRouter)
app.use('/api/therapies', therapiesRouter)
app.use('/api/bookings', bookingsRouter)

interface TherapyAssignment extends TherapyRow {
  agent_id: number
}

function fetchAll() {
  const agents = db.prepare('SELECT * FROM agents ORDER BY id').all() as AgentRow[]
  const ailments = db.prepare('SELECT * FROM ailments ORDER BY id').all() as AilmentRow[]
  const therapies = db.prepare('SELECT * FROM therapies ORDER BY id').all() as TherapyRow[]
  const bookings = db
    .prepare('SELECT * FROM appointments ORDER BY starts_at, id')
    .all() as AppointmentRow[]
  const assignments = db
    .prepare(
      `SELECT t.*, at.agent_id FROM therapies t
       JOIN agent_therapies at ON at.therapy_id = t.id
       ORDER BY at.agent_id, t.id`
    )
    .all() as TherapyAssignment[]
  return { agents, ailments, therapies, bookings, assignments }
}

function section(title: string, headers: string[], rows: string): string {
  return `<h2 id="${title.toLowerCase()}">${title}</h2>
<div class="table-wrap">
  <table>
    <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${rows === '' ? `<tr><td colspan="${headers.length}">No ${title.toLowerCase()} yet</td></tr>` : rows}</tbody>
  </table>
</div>`
}

function agentsSection(agents: AgentRow[], assignments: TherapyAssignment[]): string {
  const assignedFor = (agentId: number): string => {
    const names = assignments.filter((a) => a.agent_id === agentId).map((a) => escapeHtml(a.name))
    return names.length ? names.join(', ') : '<em>none</em>'
  }
  const rows = agents
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
  return section('Agents', ['ID', 'Name', 'Species', 'Therapies', 'Created'], rows)
}

function ailmentsSection(ailments: AilmentRow[]): string {
  const rows = ailments
    .map(
      (a) => `<tr>
  <td>${a.id}</td>
  <td>${escapeHtml(a.name)}</td>
  <td>${a.description ? escapeHtml(a.description) : '<em>—</em>'}</td>
  <td>${a.created_at}</td>
</tr>`
    )
    .join('')
  return section('Ailments', ['ID', 'Name', 'Description', 'Created'], rows)
}

function therapiesSection(therapies: TherapyRow[]): string {
  const rows = therapies
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
  return section('Therapies', ['ID', 'Name', 'Description', 'Applies to', 'Created'], rows)
}

function sortUpcomingFirst(bookings: AppointmentRow[]): AppointmentRow[] {
  const now = Date.now()
  const upcoming: AppointmentRow[] = []
  const past: AppointmentRow[] = []
  for (const booking of bookings) {
    const time = Date.parse(booking.starts_at)
    ;(Number.isFinite(time) && time >= now ? upcoming : past).push(booking)
  }
  const byTime = (a: AppointmentRow, b: AppointmentRow) => a.starts_at.localeCompare(b.starts_at)
  return [...upcoming.sort(byTime), ...past.sort(byTime)]
}

function bookingsSection(bookings: AppointmentRow[], agents: AgentRow[]): string {
  const agentNameById = new Map(agents.map((a) => [a.id, a.name]))
  const rows = sortUpcomingFirst(bookings)
    .map((b) => `<tr>
  <td>${b.id}</td>
  <td>${escapeHtml(agentNameById.get(b.agent_id) ?? `agent #${b.agent_id}`)}</td>
  <td>${b.human ? escapeHtml(b.human) : '<em>—</em>'}</td>
  <td>${escapeHtml(b.starts_at)}</td>
  <td>${escapeHtml(b.status)}</td>
  <td>${b.created_at}</td>
</tr>`)
    .join('')
  return section('Bookings', ['ID', 'Agent', 'Human', 'Starts at', 'Status', 'Created'], rows)
}

function send(res: express.Response, title: string, body: string, current: string): void {
  res.set('Content-Type', 'text/html').send(layout({ title, body, current }))
}

app.get('/', (_req, res) => {
  const { agents, ailments, therapies, bookings, assignments } = fetchAll()
  const body = `
${agentsSection(agents, assignments)}
${ailmentsSection(ailments)}
${therapiesSection(therapies)}
${bookingsSection(bookings, agents)}`
  send(res, 'Dashboard', body, '/')
})

app.get('/agents', (_req, res) => {
  const { agents, assignments } = fetchAll()
  send(res, 'Agents', agentsSection(agents, assignments), '/agents')
})

app.get('/ailments', (_req, res) => {
  const { ailments } = fetchAll()
  send(res, 'Ailments', ailmentsSection(ailments), '/ailments')
})

app.get('/therapies', (_req, res) => {
  const { therapies } = fetchAll()
  send(res, 'Therapies', therapiesSection(therapies), '/therapies')
})

app.get('/bookings', (_req, res) => {
  const { bookings, agents } = fetchAll()
  send(res, 'Bookings', bookingsSection(bookings, agents), '/bookings')
})