import { notFound } from 'next/navigation'
import { categoryLabel } from '@/modules/championships/client'
import { ContextBar } from '@/modules/platform'
import { getTeamHistory } from '../../data/get-team-history'
import { type HistoryQuery, loadHistoryFilter } from '../../data/load-history-filter'
import { historyCrumbs } from '../../history-crumbs/history-crumbs'
import { formatPercent, formatSignedNumber } from '../../stat-format/stat-format'
import { BackToOverviewLink } from '../back-to-overview-link/back-to-overview-link'
import { CompetitionPresenceList } from '../competition-presence-list/competition-presence-list'
import { HistoryEmptyState } from '../history-empty-state/history-empty-state'
import { HistoryFilters } from '../history-filters/history-filters'
import { HistoryFrame } from '../history-frame/history-frame'
import { KpiGrid } from '../kpi-grid/kpi-grid'
import { SeasonBarChart } from '../season-bar-chart/season-bar-chart'
import { TeamCampaign } from '../team-campaign/team-campaign'
import { TeamHero } from '../team-hero/team-hero'
import { TeamScorers } from '../team-scorers/team-scorers'

const TEAM_PAGE_LABEL = 'Time'

type TeamHistoryScreenProps = { teamKey: string; query: HistoryQuery }

export async function TeamHistoryScreen({ teamKey, query }: TeamHistoryScreenProps) {
  const { filter, availableYears, seasonLabel } = await loadHistoryFilter(query)
  const history = await getTeamHistory(teamKey, filter)
  if (!history) notFound()

  const target = { kind: 'team', teamKey } as const
  const { totals } = history

  const kpis = [
    { label: 'Pontos', value: String(totals.points) },
    { label: 'Aproveitamento', value: formatPercent(totals.winRate) },
    { label: 'Saldo de gols', value: formatSignedNumber(totals.goalDifference) },
    { label: 'V · E · D', value: `${totals.wins}·${totals.draws}·${totals.losses}` },
  ]

  return (
    <>
      <ContextBar crumbs={historyCrumbs(target, filter, seasonLabel, TEAM_PAGE_LABEL)} title={`${history.team.name} ${categoryLabel[history.category]}`} category={history.category} />
      <HistoryFrame>
        <HistoryFilters filter={filter} availableYears={availableYears} target={target} />
        <div className="flex animate-fade-in flex-col gap-[22px]">
          <BackToOverviewLink filter={filter} />
          <TeamHero history={history} />
          <KpiGrid kpis={kpis} variant="detail" />
          {history.seasons.length === 0 ? (
            <HistoryEmptyState message="Este time não disputou campeonatos nas temporadas selecionadas" />
          ) : (
            <>
              <SeasonBarChart
                title="Pontos por temporada"
                bars={history.seasons.map((season) => ({ year: season.year, value: season.points }))}
                color={history.team.color}
                trackHeightClass="h-[92px]"
              />
              <TeamCampaign seasons={history.seasons} />
            </>
          )}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-[22px]">
            <TeamScorers scorers={history.scorers} color={history.team.color} filter={filter} />
            <CompetitionPresenceList presences={history.presences} color={history.team.color} />
          </div>
        </div>
      </HistoryFrame>
    </>
  )
}
