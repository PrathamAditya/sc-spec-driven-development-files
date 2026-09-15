import express from 'express'
import { db } from './db'

export type BookingStatus = 'scheduled' | 'cancelled'

export interface AppointmentRow {
  id: number
  agent_id: number
  human: string | null
  starts_at: string
  status: BookingStatus
  created_at: string
}

export const bookingsRouter = express.Router()

function findBooking(id: number): AppointmentRow | undefined {
  return db.prepare('SELECT * FROM appointments WHERE id = ?').get(id) as AppointmentRow | undefined
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== ''
}

function isBookingStatus(value: unknown): value is BookingStatus {
  return value === 'scheduled' || value === 'cancelled'
}

function normalizeNullable(value: unknown): string | null {
  if (value === undefined) return value as unknown as null
  return typeof value === 'string' ? value.trim() || null : null
}

function agentExists(id: number): boolean {
  return db.prepare('SELECT 1 FROM agents WHERE id = ?').get(id) !== undefined
}

bookingsRouter.get('/', (_req, res) => {
  const bookings = db
    .prepare('SELECT * FROM appointments ORDER BY starts_at, id')
    .all() as AppointmentRow[]
  res.json(bookings)
})

bookingsRouter.get('/:id', (req, res) => {
  const booking = findBooking(Number(req.params.id))
  if (!booking) return res.status(404).json({ error: 'Booking not found' })
  res.json(booking)
})

bookingsRouter.post('/', (req, res) => {
  const { agent_id, human, starts_at, status } = req.body ?? {}

  if (!Number.isInteger(agent_id)) {
    return res.status(400).json({ error: 'agent_id is required' })
  }
  if (!agentExists(agent_id)) {
    return res.status(404).json({ error: 'Agent not found' })
  }
  if (!isNonEmptyString(starts_at)) {
    return res.status(400).json({ error: 'starts_at is required' })
  }
  if (status !== undefined && !isBookingStatus(status)) {
    return res.status(400).json({ error: 'status must be scheduled or cancelled' })
  }

  const nextStatus = isBookingStatus(status) ? status : 'scheduled'
  const result = db
    .prepare('INSERT INTO appointments (agent_id, human, starts_at, status) VALUES (?, ?, ?, ?)')
    .run(agent_id, normalizeNullable(human), starts_at.trim(), nextStatus)
  res.status(201).json(findBooking(Number(result.lastInsertRowid)))
})

bookingsRouter.patch('/:id', (req, res) => {
  const booking = findBooking(Number(req.params.id))
  if (!booking) return res.status(404).json({ error: 'Booking not found' })

  const { agent_id, human, starts_at, status } = req.body ?? {}
  if (agent_id !== undefined && !Number.isInteger(agent_id)) {
    return res.status(400).json({ error: 'agent_id must be an integer' })
  }
  if (agent_id !== undefined && !agentExists(agent_id)) {
    return res.status(404).json({ error: 'Agent not found' })
  }
  if (starts_at !== undefined && !isNonEmptyString(starts_at)) {
    return res.status(400).json({ error: 'starts_at must be a non-empty string' })
  }
  if (status !== undefined && !isBookingStatus(status)) {
    return res.status(400).json({ error: 'status must be scheduled or cancelled' })
  }

  const nextAgentId = Number.isInteger(agent_id) ? agent_id : booking.agent_id
  const nextHuman = human === undefined ? booking.human : normalizeNullable(human)
  const nextStartsAt = isNonEmptyString(starts_at) ? starts_at.trim() : booking.starts_at
  const nextStatus = isBookingStatus(status) ? status : booking.status

  db.prepare('UPDATE appointments SET agent_id = ?, human = ?, starts_at = ?, status = ? WHERE id = ?').run(
    nextAgentId,
    nextHuman,
    nextStartsAt,
    nextStatus,
    booking.id
  )
  res.json(findBooking(booking.id))
})

bookingsRouter.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM appointments WHERE id = ?').run(Number(req.params.id))
  if (result.changes === 0) return res.status(404).json({ error: 'Booking not found' })
  res.status(204).end()
})