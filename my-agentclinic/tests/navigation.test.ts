import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../src/app'

process.env.AGENTCLINIC_DB = ':memory:'

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean) as string[]

function findChrome(): string | undefined {
  const { existsSync } = require('node:fs')
  return CHROME_CANDIDATES.find((p) => existsSync(p))
}

const chromePath = findChrome()
const describeOrSkip = chromePath ? describe : describe.skip

describeOrSkip('dashboard navigation', () => {
  let server: ReturnType<typeof app.listen>
  let baseUrl: string
  let browser: import('puppeteer-core').Browser
  let page: import('puppeteer-core').Page

  beforeAll(async () => {
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => resolve())
    })
    const address = server.address()
    if (!address || typeof address === 'string') {
      throw new Error('failed to bind server')
    }
    baseUrl = `http://127.0.0.1:${address.port}`

    const puppeteer = await import('puppeteer-core')
    browser = await puppeteer.launch({ executablePath: chromePath, headless: true })
    page = await browser.newPage()
    await page.setViewport({ width: 1200, height: 800 })
    await page.goto(baseUrl, { waitUntil: 'networkidle0' })
  })

  afterAll(async () => {
    await browser?.close()
    await new Promise<void>((resolve) => server.close(() => resolve()))
  })

  it('renders nav links for every section page', async () => {
    const hrefs = await page.$$eval('.site-nav a', (as) => as.map((a) => a.getAttribute('href')))
    expect(hrefs).toEqual(['/agents', '/ailments', '/therapies', '/bookings'])
  })

  it.each([
    ['Agents', '/agents'],
    ['Ailments', '/ailments'],
    ['Therapies', '/therapies'],
    ['Bookings', '/bookings'],
  ])('clicking %s navigates to %s', async (label, path) => {
    await page.$$eval('.site-nav a', (as, label) => {
      const link = as.find((a) => a.textContent?.trim() === label) as HTMLElement
      link.click()
    }, label)

    await page.waitForFunction(
      (expected) => window.location.pathname === expected,
      { timeout: 5000 },
      path
    )
    expect(page.url()).toBe(`${baseUrl}${path}`)

    const heading = await page.$eval('main h2', (el) => el.textContent?.trim())
    expect(heading).toBe(label)
  })

  it('brand link returns to the dashboard overview', async () => {
    await page.click('.brand a')
    await page.waitForFunction(() => window.location.pathname === '/', { timeout: 5000 })
    expect(page.url()).toBe(`${baseUrl}/`)
  })

  it.each(['/', '/agents', '/ailments', '/therapies', '/bookings'])(
    'has no horizontal overflow and keeps nav links visible on a phone viewport (%s)',
    async (path) => {
      await page.setViewport({ width: 375, height: 667 })
      await page.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle0' })

      const metrics = await page.evaluate(() => {
        const clientWidth = document.documentElement.clientWidth
        const linksVisible = [...document.querySelectorAll('.site-nav a')].every((a) => {
          const rect = (a as HTMLElement).getBoundingClientRect()
          return rect.width > 0 && rect.left >= 0 && rect.right <= clientWidth
        })
        return {
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          linksVisible,
        }
      })

      expect(metrics.scrollWidth, `${path} overflows horizontally`).toBeLessThanOrEqual(metrics.innerWidth)
      expect(metrics.linksVisible, `${path} hides nav links`).toBe(true)
    }
  )
})