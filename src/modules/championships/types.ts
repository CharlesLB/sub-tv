import type { Category } from './categories'

export type SeasonYearVM = { year: number; championshipCount: number }

export type TeamBadgeVM = { name: string; abbreviation: string; color: string; crestPath: string | null }

export type PodiumRowVM = { position: number; team: TeamBadgeVM; points: number }

export type UpcomingMatchVM = { kickoffAt: string | null; round: number | null }

export type LiveMatchSummaryVM = {
  matchId: string
  home: TeamBadgeVM
  away: TeamBadgeVM
  homeScore: number
  awayScore: number
}

export type ChampionshipCardVM = {
  id: string
  name: string
  category: Category
  year: number
  statusLine: string
  isFinished: boolean
  teamCount: number
  athleteCount: number
  podium: PodiumRowVM[]
  nextMatch: UpcomingMatchVM | null
  liveMatch: LiveMatchSummaryVM | null
  lastActivityAt: string | null
}

export type ChampionshipHeaderVM = {
  id: string
  name: string
  category: Category
  year: number
  label: string
  statusLine: string
  teamCount: number
  currentRound: number | null
  isFinished: boolean
}

export type FormResult = 'V' | 'E' | 'D'

export type SquadPreviewPlayerVM = { playerId: string; shirtNumber: number | null; name: string; position: string | null }

export type StandingRowVM = {
  position: number
  seasonTeamId: string
  clubId: string
  team: TeamBadgeVM
  points: number
  played: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  form: FormResult[]
  squad: SquadPreviewPlayerVM[]
}

export type StandingGroupVM = { groupName: string | null; rows: StandingRowVM[] }

export type StandingPhaseVM = { phase: string; groups: StandingGroupVM[] }

export type TopScorerVM = {
  playerId: string
  seasonTeamId: string
  shirtNumber: number | null
  name: string
  nickname: string | null
  position: string | null
  team: TeamBadgeVM
  goals: number
  games: number
}

export type MatchStatus = 'agendado' | 'ao_vivo' | 'encerrado' | 'adiado' | 'cancelado' | 'wo'

export type MatchCardVM = {
  id: string
  phase: string | null
  round: number | null
  matchNumber: number | null
  kickoffAt: string | null
  venue: string | null
  city: string | null
  status: MatchStatus
  isBroadcast: boolean
  homeTeamId: string
  awayTeamId: string
  home: TeamBadgeVM
  away: TeamBadgeVM
  homeScore: number | null
  awayScore: number | null
  homePenalties: number | null
  awayPenalties: number | null
}

export type ChampionshipRibbonItemVM = {
  id: string
  name: string
  category: Category
  year: number
  lastActivityAt: string | null
  isFinished: boolean
}

export type ClubOptionVM = { clubId: string; badge: TeamBadgeVM }

export type CategoryClubsVM = Record<Category, ClubOptionVM[]>
