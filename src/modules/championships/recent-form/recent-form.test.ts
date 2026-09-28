import { describe, expect, it } from 'vitest'
import type { MatchCardVM } from '../types'
import { buildRecentForm } from './recent-form'

const BADGE = { name: 'Time', abbreviation: 'TIM', color: '#000000' }

const makeMatch = (overrides: Partial<MatchCardVM>): MatchCardVM => ({
  id: 'match',
  phase: 'CLASSIFICATÓRIA',
  round: 1,
  matchNumber: 1,
  kickoffAt: '2026-09-19T13:00:00.000Z',
  venue: null,
  city: null,
  status: 'encerrado',
  isBroadcast: false,
  homeTeamId: 'home',
  awayTeamId: 'away',
  home: BADGE,
  away: BADGE,
  homeScore: 0,
  awayScore: 0,
  homePenalties: null,
  awayPenalties: null,
  ...overrides,
})

describe('buildRecentForm', () => {
  it('buildRecentForm with finished matches returns wins, draws and losses per team in kickoff order', () => {
    const matches = [makeMatch({ homeScore: 2, awayScore: 1 }), makeMatch({ homeScore: 1, awayScore: 1 }), makeMatch({ homeScore: 0, awayScore: 3 })]

    const form = buildRecentForm(matches)

    expect(form.home).toEqual(['V', 'E', 'D'])
    expect(form.away).toEqual(['D', 'E', 'V'])
  })

  it('buildRecentForm with more than five matches keeps only the last five results', () => {
    const matches = [0, 1, 2, 3, 4, 5].map((index) => makeMatch({ id: String(index), homeScore: index === 0 ? 0 : 1, awayScore: 0 }))

    const form = buildRecentForm(matches)

    expect(form.home).toEqual(['V', 'V', 'V', 'V', 'V'])
  })

  it('buildRecentForm with scheduled matches ignores them', () => {
    const matches = [makeMatch({ status: 'agendado', homeScore: null, awayScore: null })]

    const form = buildRecentForm(matches)

    expect(form).toEqual({})
  })
})
