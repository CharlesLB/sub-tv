import { describe, expect, it } from 'vitest'
import { formatShortDate, formatShortDateTime, formatTime, formatTitleDate } from './format-date'

const KICKOFF = '2026-09-19T13:00:00.000Z'

describe('format-date', () => {
  it('formatShortDate with a UTC kickoff returns the São Paulo weekday, day and month in capitals', () => {
    expect(formatShortDate(KICKOFF)).toBe('SÁB 19 SET')
  })

  it('formatTime with a UTC kickoff returns the São Paulo local time', () => {
    expect(formatTime(KICKOFF)).toBe('10:00')
  })

  it('formatShortDateTime joins date and time with a middle dot', () => {
    expect(formatShortDateTime(KICKOFF)).toBe('SÁB 19 SET · 10:00')
  })

  it('formatTitleDate capitalizes weekday and month', () => {
    expect(formatTitleDate(KICKOFF)).toBe('Sáb 19 Set')
  })
})
