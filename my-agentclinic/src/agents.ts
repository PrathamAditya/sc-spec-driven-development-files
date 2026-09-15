import express from 'express'
import { db } from './db'

export interface AgentRow {
  id: number
  name: string
  species: string
  created_at: string
}

export const agentsRouter = express.Router()

agentsRouter.get('/', (_req, res) => {
  const agents = db.prepare('SELECT * FROM agents ORDER BY id').all() as AgentRow[]
  res.json(agents)
})

agentsRouter.get('/:id', (req, res) => {
  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(Number(req.params.id)) as AgentRow | undefined
  if (!agent) return res.status(404).json({ error: 'Agent not found' })
  res.json(agent)
})

agentsRouter.post('/', (req, res) => {
  const { name, species } = req.body ?? {}
  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'name is required' })
  }
  if (typeof species !== 'string' || species.trim() === '') {
    return res.status(400).json({ error: 'species is required' })
  }
  const result = db.prepare('INSERT INTO agents (name, species) VALUES (?, ?)').run(name.trim(), species.trim())
  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(result.lastInsertRowid) as AgentRow
  res.status(201).json(agent)
})

agentsRouter.patch('/:id', (req, res) => {
  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(Number(req.params.id)) as AgentRow | undefined
  if (!agent) return res.status(404).json({ error: 'Agent not found' })

  const { name, species } = req.body ?? {}
  if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
    return res.status(400).json({ error: 'name must be a non-empty string' })
  }
  if (species !== undefined && (typeof species !== 'string' || species.trim() === '')) {
    return res.status(400).json({ error: 'species must be a non-empty string' })
  }

  const nextName = typeof name === 'string' ? name.trim() : agent.name
  const nextSpecies = typeof species === 'string' ? species.trim() : agent.species
  db.prepare('UPDATE agents SET name = ?, species = ? WHERE id = ?').run(nextName, nextSpecies, agent.id)

  const updated = db.prepare('SELECT * FROM agents WHERE id = ?').get(agent.id) as AgentRow
  res.json(updated)
})

agentsRouter.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM agents WHERE id = ?').run(Number(req.params.id))
  if (result.changes === 0) return res.status(404).json({ error: 'Agent not found' })
  res.status(204).end()
})

agentsRouter.get('/:id/therapies', (req, res) => {
  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(Number(req.params.id)) as AgentRow | undefined
  if (!agent) return res.status(404).json({ error: 'Agent not found' })
  const therapies = db
    .prepare(
      `SELECT t.* FROM therapies t
       JOIN agent_therapies at ON at.therapy_id = t.id
       WHERE at.agent_id = ?
       ORDER BY t.id`
    )
    .all(agent.id)
  res.json(therapies)
})

agentsRouter.post('/:id/therapies', (req, res) => {
  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(Number(req.params.id)) as AgentRow | undefined
  if (!agent) return res.status(404).json({ error: 'Agent not found' })

  const therapyId = (req.body ?? {}).therapy_id
  if (!Number.isInteger(therapyId)) {
    return res.status(400).json({ error: 'therapy_id is required' })
  }
  const therapy = db.prepare('SELECT * FROM therapies WHERE id = ?').get(Number(therapyId))
  if (!therapy) return res.status(404).json({ error: 'Therapy not found' })

  const already = db
    .prepare('SELECT 1 FROM agent_therapies WHERE agent_id = ? AND therapy_id = ?')
    .get(agent.id, therapyId)
  if (already) return res.status(409).json({ error: 'Therapy already assigned to agent' })

  db.prepare('INSERT INTO agent_therapies (agent_id, therapy_id) VALUES (?, ?)').run(agent.id, therapyId)
  res.status(201).json(therapy)
})

agentsRouter.delete('/:id/therapies/:therapyId', (req, res) => {
  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(Number(req.params.id)) as AgentRow | undefined
  if (!agent) return res.status(404).json({ error: 'Agent not found' })
  const result = db
    .prepare('DELETE FROM agent_therapies WHERE agent_id = ? AND therapy_id = ?')
    .run(agent.id, Number(req.params.therapyId))
  if (result.changes === 0) return res.status(404).json({ error: 'Assignment not found' })
  res.status(204).end()
})

agentsRouter.get('/:id/bookings', (req, res) => {
  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(Number(req.params.id)) as AgentRow | undefined
  if (!agent) return res.status(404).json({ error: 'Agent not found' })
  const bookings = db
    .prepare('SELECT * FROM appointments WHERE agent_id = ? ORDER BY starts_at, id')
    .all(agent.id)
  res.json(bookings)
})