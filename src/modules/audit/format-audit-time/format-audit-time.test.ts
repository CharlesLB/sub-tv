import { describe, expect, it } from 'vitest'
import { formatAuditTime } from './format-audit-time'

describe('formatAuditTime', () => {
  it('formatAuditTime with a UTC instant renders the São Paulo date and 24h time', () => {
    const result = formatAuditTime('2026-09-28T01:05:00.000Z')

    expect(result).toBe('27/09/2026 22:05')
  })
})
