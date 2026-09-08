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