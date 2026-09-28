import { Suspense } from 'react'
import { type Category, categoryLabel } from '@/modules/championships'
import { type SeasonTeamVM, TeamList } from '@/modules/teams'
import { SquadSection } from '../squad-section/squad-section'
import { SquadWorkspaceSkeleton } from '../squad-workspace-skeleton/squad-workspace-skeleton'
import { SquadsEmptyState } from '../squads-empty-state/squads-empty-state'
import { squadsScreenStyles as styles } from './squads-screen.styles'

type SquadsScreenProps = {
  year: number
  teams: SeasonTeamVM[]
  categoryFilter: Category | undefined
  selectedTeam: SeasonTeamVM | null
  canEdit: boolean
  requestedPlayerId: string | undefined
}

const describeMissingTeams = (year: number, categoryFilter: Category | undefined) =>
  categoryFilter
    ? { title: `Nenhum time ${categoryLabel[categoryFilter]} em ${year}`, description: 'Troque o filtro de categoria ou escolha outra temporada.' }
    : { title: `Nenhum elenco em ${year} ainda`, description: 'Os elencos aparecem assim que as súmulas desta temporada forem importadas da FMF.' }

export function SquadsScreen({ year, teams, categoryFilter, selectedTeam, canEdit, requestedPlayerId }: SquadsScreenProps) {
  const missingTeams = describeMissingTeams(year, categoryFilter)

  return (
    <div className={styles.screen}>
      <TeamList teams={teams} year={year} categoryFilter={categoryFilter} activeTeamKey={selectedTeam?.key ?? null} />
      {selectedTeam ? (
        <Suspense key={selectedTeam.key} fallback={<SquadWorkspaceSkeleton />}>
          <SquadSection year={year} team={selectedTeam} categoryFilter={categoryFilter} canEdit={canEdit} requestedPlayerId={requestedPlayerId} />
        </Suspense>
      ) : (
        <SquadsEmptyState title={missingTeams.title} description={missingTeams.description} />
      )}
    </div>
  )
}
