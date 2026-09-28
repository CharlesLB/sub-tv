import { CATEGORY } from '@/modules/championships/client'
import type { MatchSetupVM } from '../../types'
import { awayTeamFixture, homeTeamFixture, thirdTeamFixture } from '../lineup-card/lineup-card.fixtures'

export const matchSetupFixture: MatchSetupVM = {
  championship: { id: '3b1f6c2e-8a4d-4f0e-9c7b-5d2a1e0f6b34', name: 'Mineiro', category: CATEGORY.SUB14, year: 2026, currentRound: 7 },
  teams: [homeTeamFixture, awayTeamFixture, thirdTeamFixture],
  prefill: null,
}

export const prefilledMatchSetupFixture: MatchSetupVM = {
  ...matchSetupFixture,
  prefill: {
    matchId: '9d4e2a1b-7c3f-4e8a-b6d5-1f0e2c3b4a59',
    kickoffDate: '2026-10-03',
    kickoffTime: '09:30',
    round: 8,
    venue: 'Arena do Vale · campo 2',
    homeSeasonTeamId: homeTeamFixture.seasonTeamId,
    awaySeasonTeamId: awayTeamFixture.seasonTeamId,
  },
}
