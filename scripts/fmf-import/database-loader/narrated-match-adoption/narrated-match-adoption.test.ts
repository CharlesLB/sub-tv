import { describe, expect, it } from 'vitest'
import type { TableMatch } from '../../competition-page/table-tab-parser/table-tab-parser'
import { pairNarratedMatches } from './narrated-match-adoption'

const tableMatch = (overrides: Partial<TableMatch>): TableMatch => ({
  phase: 'CLASSIFICATÓRIA',
  round: 1,
  matchNumber: 7,
  date: '2026-10-03',
  time: '09:00',
  home: { crestId: '1', crestFileName: '1.png', shortName: 'ALFA' },
  away: { crestId: '2', crestFileName: '2.png', shortName: 'BETA' },
  homeScore: null,
  awayScore: null,
  venue: null,
  city: null,
  officials: [],
  sumulaUrl: null,
  ...overrides,
})

describe('pairNarratedMatches', () => {
  it('adopts a match created in the app for the same teams on the same local date', () => {
    const candidate = { tableMatch: tableMatch({}), homeSeasonTeamId: 'home-team', awaySeasonTeamId: 'away-team' }
    const narrated = { id: 'narrated', phase: null, matchNumber: null, homeTeamId: 'home-team', awayTeamId: 'away-team', kickoffAt: new Date('2026-10-03T23:30:00-03:00') }

    expect(pairNarratedMatches([candidate], [narrated])).toEqual([{ matchId: 'narrated', candidate }])
  })

  it('does not adopt when the FMF match already exists or the date differs', () => {
    const candidate = { tableMatch: tableMatch({}), homeSeasonTeamId: 'home-team', awaySeasonTeamId: 'away-team' }
    const alreadyLoaded = { id: 'fmf', phase: 'CLASSIFICATÓRIA', matchNumber: 7, homeTeamId: 'home-team', awayTeamId: 'away-team', kickoffAt: null }
    const otherDay = { id: 'narrated', phase: null, matchNumber: null, homeTeamId: 'home-team', awayTeamId: 'away-team', kickoffAt: new Date('2026-10-04T12:00:00-03:00') }

    expect(pairNarratedMatches([candidate], [alreadyLoaded, otherDay])).toEqual([])
    expect(pairNarratedMatches([candidate], [otherDay])).toEqual([])
  })
})
