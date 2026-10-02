import { type Category, isCategory } from '@/modules/championships/client'
import type { SeasonTeamVM } from '../../types'

export type SquadSelectionQuery = { category: string | null | undefined; teamKey: string | null | undefined }

export type SquadSelection = { categoryFilter: Category | undefined; visibleTeams: SeasonTeamVM[]; selectedTeam: SeasonTeamVM | null }

export const selectSquadTeam = (teams: SeasonTeamVM[], query: SquadSelectionQuery): SquadSelection => {
  const categoryFilter = isCategory(query.category) ? query.category : undefined
  const visibleTeams = categoryFilter ? teams.filter((team) => team.category === categoryFilter) : teams
  const selectedTeam = teams.find((team) => team.key === query.teamKey) ?? visibleTeams[0] ?? null

  return { categoryFilter, visibleTeams, selectedTeam }
}
