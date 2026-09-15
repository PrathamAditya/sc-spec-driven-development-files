import { describe, expect, it } from 'vitest'
import { escapeHtml } from './Main'

describe('escapeHtml', () => {
  it('escapes HTML special characters', () => {
    expect(escapeHtml('<script>"x"&\'y\'</script>')).toBe('&lt;script&gt;&quot;x&quot;&amp;&#39;y&#39;&lt;/script&gt;')
  })

  it('leaves plain text unchanged', () => {
    expect(escapeHtml('Ada, dev-agent')).toBe('Ada, dev-agent')
  })
})