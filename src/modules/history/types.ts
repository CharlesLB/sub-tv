import type { Category, FormResult, TeamBadgeVM } from '@/modules/championships/client'
import type { CompetitionPresence } from './lib/competition-presences/competition-presences'

export type TeamRecordVM = {
  played: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  points: number
}

export type AccumulatedTeamRowVM = TeamRecordVM & {
  teamKey: string
  category: Category
  team: TeamBadgeVM
  goalDifference: number
  winRate: number
}

export type PeriodScorerVM = {
  playerId: string
  name: string
  category: Category
  team: TeamBadgeVM
  goals: number
  games: number
  seasonCount: number
}

export type HistoryOverviewVM = {
  championshipCount: number
  matchCount: number
  goalCount: number
  bestWinRate: AccumulatedTeamRowVM | null
  mostGames: AccumulatedTeamRowVM | null
  table: AccumulatedTeamRowVM[]
  scorers: PeriodScorerVM[]
}

export type TeamSeasonVM = TeamRecordVM & { year: number; championships: string[]; form: FormResult[] }

export type TeamScorerVM = { playerId: string; name: string; goals: number; games: number }

export type TeamHistoryVM = {
  teamKey: string
  category: Category
  team: TeamBadgeVM
  totals: TeamRecordVM & { goalDifference: number; winRate: number }
  seasons: TeamSeasonVM[]
  scorers: TeamScorerVM[]
  presences: CompetitionPresence[]
}

export type AthleteSeasonVM = { year: number; championships: string[]; games: number; goals: number }

export type AthleteHistoryVM = {
  playerId: string
  name: string
  nickname: string | null
  position: string | null
  shirtNumber: number | null
  team: TeamBadgeVM | null
  category: Category | null
  goals: number
  games: number
  seasons: AthleteSeasonVM[]
  bestSeason: AthleteSeasonVM | null
}
