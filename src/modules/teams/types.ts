import type { Category, TeamBadgeVM } from '@/modules/championships/client'

export type SeasonTeamVM = {
  key: string
  clubId: string
  category: Category
  badge: TeamBadgeVM
  athleteCount: number
}
