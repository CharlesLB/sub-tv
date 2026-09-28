import { CATEGORY } from '@/modules/championships/client'
import type { AthleteHistoryVM } from '../../types'

export const athleteHistoryFixture: AthleteHistoryVM = {
  playerId: '6f0c8a52-0d8e-4c1b-9d52-4a3a0f1e2b10',
  name: 'Lucas Andrade',
  nickname: 'Luquinhas',
  position: 'Meia',
  shirtNumber: 10,
  team: { name: 'Cruzeiro', abbreviation: 'CRU', color: '#1f4fa3', crestPath: null },
  category: CATEGORY.SUB14,
  goals: 17,
  games: 24,
  seasons: [
    { year: 2024, championships: ['Mineiro Sub-13'], games: 11, goals: 6 },
    { year: 2025, championships: ['Mineiro Sub-14'], games: 13, goals: 11 },
  ],
  bestSeason: { year: 2025, championships: ['Mineiro Sub-14'], games: 13, goals: 11 },
}

export const athleteWithoutTeamFixture: AthleteHistoryVM = {
  ...athleteHistoryFixture,
  nickname: null,
  position: null,
  shirtNumber: null,
  team: null,
  category: null,
}
