import { beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import type { Express } from 'express'

process.env.AGENTCLINIC_DB = ':memory:'

let app: Express
let agentId: number
let therapyA: number
let therapyB: number

beforeAll(async () => {
  app = (await import('../src/app')).app
  const agent = await request(app).post('/api/agents').send({ name: 'Ada', species: 'dev-agent' })
  agentId = agent.body.id
  const a = await request(app).post('/api/therapies').send({ name: 'Memory defrag' })
  const b = await request(app).post('/api/therapies').send({ name: 'Prompt tuning' })
  therapyA = a.body.id
  therapyB = b.body.id
})

describe('GET /api/agents/:id/therapies', () => {
  it('returns an empty list when nothing is assigned', async () => {
    const res = await request(app).get(`/api/agents/${agentId}/therapies`)
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('returns 404 for an unknown agent', async () => {
    const res = await request(app).get('/api/agents/9999/therapies')
    expect(res.status).toBe(404)
  })
})

describe('POST /api/agents/:id/therapies', () => {
  it('assigns a therapy', async () => {
    const res = await request(app).post(`/api/agents/${agentId}/therapies`).send({ therapy_id: therapyA })
    expect(res.status).toBe(201)
    expect(res.body.id).toBe(therapyA)
  })

  it('returns 400 when therapy_id is missing', async () => {
    const res = await request(app).post(`/api/agents/${agentId}/therapies`).send({})
    expect(res.status).toBe(400)
  })

  it('returns 404 for an unknown agent', async () => {
    const res = await request(app).post('/api/agents/9999/therapies').send({ therapy_id: therapyA })
    expect(res.status).toBe(404)
  })

  it('returns 404 for an unknown therapy', async () => {
    const res = await request(app).post(`/api/agents/${agentId}/therapies`).send({ therapy_id: 9999 })
    expect(res.status).toBe(404)
  })

  it('handles duplicate assignment gracefully (409)', async () => {
    const res = await request(app).post(`/api/agents/${agentId}/therapies`).send({ therapy_id: therapyA })
    expect(res.status).toBe(409)
    expect(res.body).toEqual({ error: 'Therapy already assigned to agent' })
  })
})

describe('GET (after assignment)', () => {
  it('lists assigned therapies including the new one', async () => {
    await request(app).post(`/api/agents/${agentId}/therapies`).send({ therapy_id: therapyB })
    const res = await request(app).get(`/api/agents/${agentId}/therapies`)
    expect(res.status).toBe(200)
    expect(res.body.map((t: { id: number }) => t.id).sort()).toEqual([therapyA, therapyB].sort())
  })
})

describe('DELETE /api/agents/:id/therapies/:therapyId', () => {
  it('removes an assignment (204)', async () => {
    const res = await request(app).delete(`/api/agents/${agentId}/therapies/${therapyB}`)
    expect(res.status).toBe(204)
  })

  it('returns 404 for a missing assignment', async () => {
    const res = await request(app).delete(`/api/agents/${agentId}/therapies/${therapyB}`)
    expect(res.status).toBe(404)
  })

  it('returns 404 for an unknown agent', async () => {
    const res = await request(app).delete(`/api/agents/9999/therapies/${therapyA}`)
    expect(res.status).toBe(404)
  })
})