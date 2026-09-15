import express from 'express'
import { db } from './db'

export interface AilmentRow {
  id: number
  name: string
  description: string | null
  created_at: string
}

export const ailmentsRouter = express.Router()

function findAilment(id: number): AilmentRow | undefined {
  return db.prepare('SELECT * FROM ailments WHERE id = ?').get(id) as AilmentRow | undefined
}

function isValidName(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== ''
}

function normalizeDescription(value: unknown): string | null {
  if (value === undefined) return value as unknown as null
  return typeof value === 'string' ? value.trim() || null : null
}

ailmentsRouter.get('/', (_req, res) => {
  const ailments = db.prepare('SELECT * FROM ailments ORDER BY id').all() as AilmentRow[]
  res.json(ailments)
})

ailmentsRouter.get('/:id', (req, res) => {
  const ailment = findAilment(Number(req.params.id))
  if (!ailment) return res.status(404).json({ error: 'Ailment not found' })
  res.json(ailment)
})

ailmentsRouter.post('/', (req, res) => {
  const { name, description } = req.body ?? {}
  if (!isValidName(name)) {
    return res.status(400).json({ error: 'name is required' })
  }
  const result = db
    .prepare('INSERT INTO ailments (name, description) VALUES (?, ?)')
    .run(name.trim(), normalizeDescription(description))
  res.status(201).json(findAilment(Number(result.lastInsertRowid)))
})

ailmentsRouter.patch('/:id', (req, res) => {
  const ailment = findAilment(Number(req.params.id))
  if (!ailment) return res.status(404).json({ error: 'Ailment not found' })

  const { name, description } = req.body ?? {}
  if (name !== undefined && !isValidName(name)) {
    return res.status(400).json({ error: 'name must be a non-empty string' })
  }

  const nextName = isValidName(name) ? name.trim() : ailment.name
  const desc = description === undefined ? ailment.description : normalizeDescription(description)
  db.prepare('UPDATE ailments SET name = ?, description = ? WHERE id = ?').run(nextName, desc, ailment.id)
  res.json(findAilment(ailment.id))
})

ailmentsRouter.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM ailments WHERE id = ?').run(Number(req.params.id))
  if (result.changes === 0) return res.status(404).json({ error: 'Ailment not found' })
  res.status(204).end()
})