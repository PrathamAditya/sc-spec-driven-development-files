import { beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import type { Express } from 'express'

process.env.AGENTCLINIC_DB = ':memory:'

let app: Express
let agentId: number
let agent2Id: number

beforeAll(async () => {
  app = (await import('../src/app')).app
  const a = await request(app).post('/api/agents').send({ name: 'Ada', species: 'dev-agent' })
  const b = await request(app).post('/api/agents').send({ name: 'Grace', species: 'ops-agent' })
  agentId = a.body.id
  agent2Id = b.body.id
})

describe('GET /api/bookings', () => {
  it('returns an empty list initially', async () => {
    const res = await request(app).get('/api/bookings')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })
})

describe('POST /api/bookings', () => {
  it('creates a booking with default status scheduled', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({ agent_id: agentId, human: 'Mary', starts_at: '2026-09-20 10:00' })
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({
      agent_id: agentId,
      human: 'Mary',
      starts_at: '2026-09-20 10:00',
      status: 'scheduled',
    })
  })

  it('returns 400 when agent_id is missing', async () => {
    const res = await request(app).post('/api/bookings').send({ starts_at: '2026-09-20 11:00' })
    expect(res.status).toBe(400)
  })

  it('returns 400 when starts_at is missing', async () => {
    const res = await request(app).post('/api/bookings').send({ agent_id: agentId })
    expect(res.status).toBe(400)
  })

  it('returns 400 for an invalid status', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({ agent_id: agentId, starts_at: '2026-09-20 11:00', status: 'done' })
    expect(res.status).toBe(400)
  })

  it('returns 404 for an unknown agent', async () => {
    const res = await request(app).post('/api/bookings').send({ agent_id: 9999, starts_at: '2026-09-20 11:00' })
    expect(res.status).toBe(404)
  })
})

describe('GET /api/bookings/:id', () => {
  it('gets an existing booking', async () => {
    const created = await request(app)
      .post('/api/bookings')
      .send({ agent_id: agentId, starts_at: '2026-09-21 09:00' })
    const res = await request(app).get(`/api/bookings/${created.body.id}`)
    expect(res.status).toBe(200)
    expect(res.body.starts_at).toBe('2026-09-21 09:00')
  })

  it('returns 404 for a missing booking', async () => {
    const res = await request(app).get('/api/bookings/9999')
    expect(res.status).toBe(404)
  })
})

describe('PATCH /api/bookings/:id (reschedule / cancel)', () => {
  it('reschedules by updating starts_at', async () => {
    const created = await request(app)
      .post('/api/bookings')
      .send({ agent_id: agentId, starts_at: '2026-09-21 09:00' })
    const res = await request(app).patch(`/api/bookings/${created.body.id}`).send({ starts_at: '2026-09-22 15:30' })
    expect(res.status).toBe(200)
    expect(res.body.starts_at).toBe('2026-09-22 15:30')
    expect(res.body.status).toBe('scheduled')
  })

  it('cancels via status transition', async () => {
    const created = await request(app)
      .post('/api/bookings')
      .send({ agent_id: agentId, starts_at: '2026-09-21 10:00' })
    const res = await request(app).patch(`/api/bookings/${created.body.id}`).send({ status: 'cancelled' })
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('cancelled')
  })

  it('returns 404 for a missing booking', async () => {
    const res = await request(app).patch('/api/bookings/9999').send({ starts_at: '2026-09-22 10:00' })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /api/bookings/:id', () => {
  it('deletes a booking (204)', async () => {
    const created = await request(app)
      .post('/api/bookings')
      .send({ agent_id: agentId, starts_at: '2026-09-23 09:00' })
    const res = await request(app).delete(`/api/bookings/${created.body.id}`)
    expect(res.status).toBe(204)
  })

  it('returns 404 for a missing booking', async () => {
    const res = await request(app).delete('/api/bookings/9999')
    expect(res.status).toBe(404)
  })
})

describe('GET /api/agents/:id/bookings', () => {
  it('lists bookings scoped to an agent', async () => {
    await request(app)
      .post('/api/bookings')
      .send({ agent_id: agent2Id, starts_at: '2026-09-24 09:00' })
    const res = await request(app).get(`/api/agents/${agent2Id}/bookings`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].agent_id).toBe(agent2Id)
  })

  it('returns 404 for an unknown agent', async () => {
    const res = await request(app).get('/api/agents/9999/bookings')
    expect(res.status).toBe(404)
  })
})