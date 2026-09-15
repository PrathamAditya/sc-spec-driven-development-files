import { beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import type { Express } from 'express'

process.env.AGENTCLINIC_DB = ':memory:'

let app: Express

beforeAll(async () => {
  app = (await import('../src/app')).app
})

describe('GET /api/therapies', () => {
  it('returns an empty list initially', async () => {
    const res = await request(app).get('/api/therapies')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })
})

describe('POST /api/therapies', () => {
  it('creates a therapy', async () => {
    const res = await request(app)
      .post('/api/therapies')
      .send({ name: 'Memory defrag', description: 'Heap compaction', applies_to: 'dev-agents' })
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({
      name: 'Memory defrag',
      description: 'Heap compaction',
      applies_to: 'dev-agents',
    })
  })

  it('returns 400 when name is missing', async () => {
    const res = await request(app).post('/api/therapies').send({})
    expect(res.status).toBe(400)
  })
})

describe('GET /api/therapies/:id', () => {
  it('gets an existing therapy', async () => {
    const created = await request(app).post('/api/therapies').send({ name: 'Log sanitization' })
    const res = await request(app).get(`/api/therapies/${created.body.id}`)
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Log sanitization')
  })

  it('returns 404 for a missing therapy', async () => {
    const res = await request(app).get('/api/therapies/9999')
    expect(res.status).toBe(404)
  })
})

describe('PATCH /api/therapies/:id', () => {
  it('updates a therapy', async () => {
    const created = await request(app).post('/api/therapies').send({ name: 'Prompt tuning' })
    const res = await request(app).patch(`/api/therapies/${created.body.id}`).send({ applies_to: 'all' })
    expect(res.status).toBe(200)
    expect(res.body.applies_to).toBe('all')
  })

  it('returns 404 for a missing therapy', async () => {
    const res = await request(app).patch('/api/therapies/9999').send({ name: 'x' })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /api/therapies/:id', () => {
  it('deletes a therapy (204)', async () => {
    const created = await request(app).post('/api/therapies').send({ name: 'Doomed therapy' })
    const res = await request(app).delete(`/api/therapies/${created.body.id}`)
    expect(res.status).toBe(204)
  })

  it('returns 404 for a missing therapy', async () => {
    const res = await request(app).delete('/api/therapies/9999')
    expect(res.status).toBe(404)
  })
})