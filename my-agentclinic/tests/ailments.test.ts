import { beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import type { Express } from 'express'

process.env.AGENTCLINIC_DB = ':memory:'

let app: Express

beforeAll(async () => {
  app = (await import('../src/app')).app
})

describe('GET /api/ailments', () => {
  it('returns an empty list initially', async () => {
    const res = await request(app).get('/api/ailments')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })
})

describe('POST /api/ailments', () => {
  it('creates an ailment', async () => {
    const res = await request(app).post('/api/ailments').send({ name: 'Latency spikes', description: 'High response times' })
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({ name: 'Latency spikes', description: 'High response times' })
    expect(res.body.id).toBeGreaterThan(0)
  })

  it('returns 400 when name is missing', async () => {
    const res = await request(app).post('/api/ailments').send({})
    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'name is required' })
  })
})

describe('GET /api/ailments/:id', () => {
  it('gets an existing ailment', async () => {
    const created = await request(app).post('/api/ailments').send({ name: 'Context overflow' })
    const res = await request(app).get(`/api/ailments/${created.body.id}`)
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Context overflow')
  })

  it('returns 404 for a missing ailment', async () => {
    const res = await request(app).get('/api/ailments/9999')
    expect(res.status).toBe(404)
    expect(res.body).toEqual({ error: 'Ailment not found' })
  })
})

describe('PATCH /api/ailments/:id', () => {
  it('updates an ailment', async () => {
    const created = await request(app).post('/api/ailments').send({ name: 'Directive drift' })
    const res = await request(app)
      .patch(`/api/ailments/${created.body.id}`)
      .send({ name: 'Directive drift', description: 'Needs realignment' })
    expect(res.status).toBe(200)
    expect(res.body.description).toBe('Needs realignment')
  })

  it('returns 404 for a missing ailment', async () => {
    const res = await request(app).patch('/api/ailments/9999').send({ name: 'x' })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /api/ailments/:id', () => {
  it('deletes an ailment (204)', async () => {
    const created = await request(app).post('/api/ailments').send({ name: 'Doomed' })
    const res = await request(app).delete(`/api/ailments/${created.body.id}`)
    expect(res.status).toBe(204)
  })

  it('returns 404 for a missing ailment', async () => {
    const res = await request(app).delete('/api/ailments/9999')
    expect(res.status).toBe(404)
  })
})