import { describe, expect, it } from 'vitest'
import { describeWhen } from './describe-when'

const NOW = new Date('2026-09-19T15:00:00.000Z')

describe('describeWhen', () => {
  it('describeWhen with a match earlier today returns HOJE', () => {
    expect(describeWhen('2026-09-19T12:00:00.000Z', NOW)).toBe('HOJE')
  })

  it('describeWhen with a match six days ago returns the day count', () => {
    expect(describeWhen('2026-09-13T12:00:00.000Z', NOW)).toBe('HÁ 6 DIAS')
  })

  it('describeWhen with an old match returns month and year', () => {
    expect(describeWhen('2023-11-29T12:00:00.000Z', NOW)).toBe('NOV 2023')
  })

  it('describeWhen with an old match late at night in São Paulo uses the local month', () => {
    expect(describeWhen('2023-10-01T01:00:00.000Z', NOW)).toBe('SET 2023')
  })

  it('describeWhen without a date returns an empty label', () => {
    expect(describeWhen(null, NOW)).toBe('')
  })
})
