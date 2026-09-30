'use client'

import { useSearchParams } from 'next/navigation'
import { CATEGORY_PARAMETER, TEAM_PARAMETER } from '@/lib/routes'
import { CategoryTag } from '@/modules/championships/client'
import { selectSquadTeam } from '../../lib/squad-selection/squad-selection'
import type { SeasonTeamVM } from '../../types'

export function SelectedTeamCategory({ teams }: { teams: SeasonTeamVM[] }) {
  const searchParams = useSearchParams()
  const { selectedTeam } = selectSquadTeam(teams, { category: searchParams.get(CATEGORY_PARAMETER), teamKey: searchParams.get(TEAM_PARAMETER) })

  return selectedTeam ? <CategoryTag category={selectedTeam.category} size="large" /> : null
}
