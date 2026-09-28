import { Suspense } from 'react'
import { AUDIT_ENTITY, LastChange } from '@/modules/audit'
import { type Category, categoryLabel } from '@/modules/championships'
import type { SeasonTeamVM } from '@/modules/teams'
import { getTeamSquad } from '../../data/get-team-squad'
import { SquadWorkspace } from '../squad-workspace/squad-workspace'
import { SquadsEmptyState } from '../squads-empty-state/squads-empty-state'

type SquadSectionProps = {
  year: number
  team: SeasonTeamVM
  categoryFilter: Category | undefined
  canEdit: boolean
  requestedPlayerId: string | undefined
}

export async function SquadSection({ year, team, categoryFilter, canEdit, requestedPlayerId }: SquadSectionProps) {
  const squad = await getTeamSquad(year, team.category, team.clubId)

  if (!squad) {
    return <SquadsEmptyState title={`${team.badge.name} ${categoryLabel[team.category]} sem elenco`} description={`Nenhum atleta vinculado em ${year} ainda.`} />
  }

  const lastChangePlayerId = (squad.players.find((player) => player.id === requestedPlayerId) ?? squad.players[0])?.id ?? null

  const lastChange = lastChangePlayerId ? (
    <Suspense key={lastChangePlayerId} fallback={null}>
      <LastChange entityType={AUDIT_ENTITY.PLAYER} entityId={lastChangePlayerId} />
    </Suspense>
  ) : null

  return <SquadWorkspace key={squad.key} squad={squad} categoryFilter={categoryFilter} canEdit={canEdit} lastChange={{ playerId: lastChangePlayerId, content: lastChange }} />
}
