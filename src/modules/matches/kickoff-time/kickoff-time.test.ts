import { describe, expect, it } from 'vitest'
import { formatDateInput, isDateInput, isTimeInput, toDateInputInSaoPaulo, toKickoffInstant, toTimeInputInSaoPaulo } from './kickoff-time'

describe('kickoff-time', () => {
  it('toDateInputInSaoPaulo late at night in UTC returns the previous São Paulo day', () => {
    expect(toDateInputInSaoPaulo(new Date('2026-09-20T02:30:00.000Z'))).toBe('2026-09-19')
  })

  it('toTimeInputInSaoPaulo with a UTC instant returns the local hour and minute', () => {
    expect(toTimeInputInSaoPaulo(new Date('2026-09-19T13:00:00.000Z'))).toBe('10:00')
  })

  it('toKickoffInstant with a local date and time returns the instant at the -03:00 offset', () => {
    expect(toKickoffInstant('2026-09-19', '10:00').toISOString()).toBe('2026-09-19T13:00:00.000Z')
  })

  it('formatDateInput with a date input returns the short broadcast label', () => {
    expect(formatDateInput('2026-09-19')).toBe('SÁB 19 SET')
  })

  it('formatDateInput with an empty value returns an empty label', () => {
    expect(formatDateInput('')).toBe('')
  })

  it('isDateInput and isTimeInput reject malformed values', () => {
    expect(isDateInput('19/09/2026')).toBe(false)
    expect(isDateInput('2026-13-40')).toBe(false)
    expect(isTimeInput('24:00')).toBe(false)
    expect(isTimeInput('09:30')).toBe(true)
  })
})
