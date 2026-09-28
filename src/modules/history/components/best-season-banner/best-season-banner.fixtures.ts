import type { AthleteSeasonVM } from '../../types'

export const bestSeasonFixture: AthleteSeasonVM = { year: 2025, championships: ['Mineiro Sub-14', 'Copa Integração'], games: 13, goals: 11 }

export const singleGoalSeasonFixture: AthleteSeasonVM = { ...bestSeasonFixture, goals: 1 }
