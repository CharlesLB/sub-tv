import type { z } from 'zod'
import type { Category, TeamBadgeVM } from '@/modules/championships/client'
import type { PlayerPositionSchema, PreferredFootSchema } from './schemas'

export type PlayerPosition = z.infer<typeof PlayerPositionSchema>

export type PreferredFoot = z.infer<typeof PreferredFootSchema>

export type CuriosityVM = { id: string; text: string }

export type SquadPlayerVM = {
  id: string
  shirtNumber: number | null
  fullName: string
  nickname: string | null
  displayName: string | null
  position: PlayerPosition | null
  preferredFoot: PreferredFoot | null
  games: number
  goals: number
  yellowCards: number
  redCards: number
  curiosities: CuriosityVM[]
  isInOtherCategory: boolean
}

export type TeamSquadVM = {
  key: string
  clubId: string
  category: Category
  year: number
  badge: TeamBadgeVM
  otherCategoryKey: string
  players: SquadPlayerVM[]
}

export type SquadQuery = {
  year: number
  categoryFilter: Category | undefined
  teamKey: string
}
