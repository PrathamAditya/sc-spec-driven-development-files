import express from 'express'
import { db } from './db'

export interface TherapyRow {
  id: number
  name: string
  description: string | null
  applies_to: string | null
  created_at: string
}

export const therapiesRouter = express.Router()

function findTherapy(id: number): TherapyRow | undefined {
  return db.prepare('SELECT * FROM therapies WHERE id = ?').get(id) as TherapyRow | undefined
}

function isValidName(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== ''
}

function normalizeNullable(value: unknown): string | null {
  if (value === undefined) return value as unknown as null
  return typeof value === 'string' ? value.trim() || null : null
}

therapiesRouter.get('/', (_req, res) => {
  const therapies = db.prepare('SELECT * FROM therapies ORDER BY id').all() as TherapyRow[]
  res.json(therapies)
})

therapiesRouter.get('/:id', (req, res) => {
  const therapy = findTherapy(Number(req.params.id))
  if (!therapy) return res.status(404).json({ error: 'Therapy not found' })
  res.json(therapy)
})

therapiesRouter.post('/', (req, res) => {
  const { name, description, applies_to } = req.body ?? {}
  if (!isValidName(name)) {
    return res.status(400).json({ error: 'name is required' })
  }
  const result = db
    .prepare('INSERT INTO therapies (name, description, applies_to) VALUES (?, ?, ?)')
    .run(name.trim(), normalizeNullable(description), normalizeNullable(applies_to))
  res.status(201).json(findTherapy(Number(result.lastInsertRowid)))
})

therapiesRouter.patch('/:id', (req, res) => {
  const therapy = findTherapy(Number(req.params.id))
  if (!therapy) return res.status(404).json({ error: 'Therapy not found' })

  const { name, description, applies_to } = req.body ?? {}
  if (name !== undefined && !isValidName(name)) {
    return res.status(400).json({ error: 'name must be a non-empty string' })
  }

  const nextName = isValidName(name) ? name.trim() : therapy.name
  const desc = description === undefined ? therapy.description : normalizeNullable(description)
  const appliesTo = applies_to === undefined ? therapy.applies_to : normalizeNullable(applies_to)
  db.prepare('UPDATE therapies SET name = ?, description = ?, applies_to = ? WHERE id = ?').run(
    nextName,
    desc,
    appliesTo,
    therapy.id
  )
  res.json(findTherapy(therapy.id))
})

therapiesRouter.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM therapies WHERE id = ?').run(Number(req.params.id))
  if (result.changes === 0) return res.status(404).json({ error: 'Therapy not found' })
  res.status(204).end()
})