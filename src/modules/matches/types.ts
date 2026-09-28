import type { Category } from '@/modules/championships/client'
import type { PlayerPosition } from './pitch-layout/pitch-layout'

export type ActiveBroadcastVM = {
  matchId: string
  seasonId: string
  homeName: string
  awayName: string
}

export type MatchSide = 'home' | 'away'

export type SetupPlayerVM = {
  playerId: string
  shirtNumber: number
  name: string
  nickname: string | null
  position: PlayerPosition | null
}

export type SetupTeamVM = {
  seasonTeamId: string
  name: string
  abbreviation: string
  color: string
  crestPath: string | null
  players: SetupPlayerVM[]
  defaultStarterIds: string[]
}

export type PrefillMatchVM = {
  matchId: string
  kickoffDate: string | null
  kickoffTime: string | null
  round: number | null
  venue: string | null
  homeSeasonTeamId: string
  awaySeasonTeamId: string
}

export type SetupChampionshipVM = {
  id: string
  name: string
  category: Category
  year: number
  currentRound: number | null
}

export type MatchSetupVM = {
  championship: SetupChampionshipVM
  teams: SetupTeamVM[]
  prefill: PrefillMatchVM | null
}
