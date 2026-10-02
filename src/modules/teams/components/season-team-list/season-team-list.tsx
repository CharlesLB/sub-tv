'use client'

import { useSearchParams } from 'next/navigation'
import { CATEGORY_PARAMETER, TEAM_PARAMETER } from '@/lib/routes'
import { selectSquadTeam } from '../../lib/squad-selection/squad-selection'
import type { SeasonTeamVM } from '../../types'
import { TeamList } from '../team-list/team-list'

type SeasonTeamListProps = { teams: SeasonTeamVM[]; year: number }

export function SeasonTeamList({ teams, year }: SeasonTeamListProps) {
  const searchParams = useSearchParams()
  const { categoryFilter, visibleTeams, selectedTeam } = selectSquadTeam(teams, { category: searchParams.get(CATEGORY_PARAMETER), teamKey: searchParams.get(TEAM_PARAMETER) })

  return <TeamList teams={visibleTeams} year={year} categoryFilter={categoryFilter} activeTeamKey={selectedTeam?.key ?? null} />
}
