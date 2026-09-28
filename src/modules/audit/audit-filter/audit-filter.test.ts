import { describe, expect, it } from 'vitest'
import { parseAuditFilter, periodStart, toAuditRouteQuery } from './audit-filter'

const USER_ID = '76de1a54-4988-4840-98a2-7e8813632d0b'

describe('parseAuditFilter', () => {
  it('parseAuditFilter with valid params returns every filter', () => {
    const filter = parseAuditFilter({ user: USER_ID, action: 'entrou', entity: 'usuario', period: '7d', page: '3' })

    expect(filter).toEqual({ userId: USER_ID, action: 'entrou', entityType: 'usuario', period: '7d', page: 3 })
  })

  it('parseAuditFilter with invalid params falls back to the unfiltered first page', () => {
    const filter = parseAuditFilter({ user: 'abc', action: 'hack', entity: 'x', period: '99d', page: '-2' })

    expect(filter).toEqual({ userId: null, action: null, entityType: null, period: 'tudo', page: 1 })
  })
})

describe('periodStart', () => {
  it('periodStart for the last seven days subtracts seven days from now', () => {
    const now = new Date('2026-09-27T12:00:00Z')

    expect(periodStart('7d', now)?.toISOString()).toBe('2026-09-20T12:00:00.000Z')
    expect(periodStart('tudo', now)).toBeNull()
  })
})

describe('toAuditRouteQuery', () => {
  it('toAuditRouteQuery omits defaults so the URL stays short', () => {
    const query = toAuditRouteQuery({ userId: null, action: 'entrou', entityType: null, period: 'tudo', page: 1 })

    expect(query).toEqual({ userId: undefined, action: 'entrou', entityType: undefined, period: undefined, page: undefined })
  })
})
