import { type Category, categoryLabel } from '@/modules/championships'
import { type SeasonTeamVM, selectSquadTeam } from '@/modules/teams'
import { SquadSection } from '../squad-section/squad-section'
import { SquadsEmptyState } from '../squads-empty-state/squads-empty-state'

type SquadPanelProps = {
  year: number
  teams: SeasonTeamVM[]
  query: { category: string | undefined; teamKey: string | undefined }
  canEdit: boolean
  requestedPlayerId: string | undefined
}

const describeMissingTeams = (year: number, categoryFilter: Category | undefined) =>
  categoryFilter
    ? { title: `Nenhum time ${categoryLabel[categoryFilter]} em ${year}`, description: 'Troque o filtro de categoria ou escolha outra temporada.' }
    : { title: `Nenhum elenco em ${year} ainda`, description: 'Os elencos aparecem assim que as súmulas desta temporada forem importadas da FMF.' }

export function SquadPanel({ year, teams, query, canEdit, requestedPlayerId }: SquadPanelProps) {
  const { categoryFilter, selectedTeam } = selectSquadTeam(teams, query)

  if (!selectedTeam) {
    const missingTeams = describeMissingTeams(year, categoryFilter)

    return <SquadsEmptyState title={missingTeams.title} description={missingTeams.description} />
  }

  return <SquadSection year={year} team={selectedTeam} categoryFilter={categoryFilter} canEdit={canEdit} requestedPlayerId={requestedPlayerId} />
}
