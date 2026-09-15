import { beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import type { Express } from 'express'

process.env.AGENTCLINIC_DB = ':memory:'

let app: Express

beforeAll(async () => {
  app = (await import('../src/app')).app
})

const PAGES: Array<[string, string, string]> = [
  ['/agents', 'Agents', '/agents'],
  ['/ailments', 'Ailments', '/ailments'],
  ['/therapies', 'Therapies', '/therapies'],
  ['/bookings', 'Bookings', '/bookings'],
]

describe('section pages', () => {
  it.each(PAGES)('GET %s renders the %s section with working nav', async (route, label, activeHref) => {
    const res = await request(app).get(route)
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toContain('text/html')
    expect(res.text).toContain(`<h2 id="${label.toLowerCase()}">`)
    expect(res.text).toContain(`<a href="/agents"`)
    expect(res.text).toContain(`<a href="/ailments"`)
    expect(res.text).toContain(`<a href="/therapies"`)
    expect(res.text).toContain(`<a href="/bookings"`)
    expect(res.text).toContain(`href="${activeHref}" class="active" aria-current="page"`)
  })

  it('renders an empty state when the section has no data', async () => {
    const res = await request(app).get('/bookings')
    expect(res.text).toContain('No bookings yet')
  })
})

describe('dashboard overview', () => {
  it('GET / renders all four sections for a quick demo view', async () => {
    const res = await request(app).get('/')
    expect(res.status).toBe(200)
    for (const label of ['Agents', 'Ailments', 'Therapies', 'Bookings']) {
      expect(res.text).toContain(`<h2 id="${label.toLowerCase()}">${label}</h2>`)
    }
  })
})