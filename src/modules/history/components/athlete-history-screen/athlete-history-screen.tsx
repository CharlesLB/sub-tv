import { notFound } from 'next/navigation'
import { ContextBar } from '@/modules/platform'
import { getAthleteHistory } from '../../data/get-athlete-history'
import { loadHistoryFilter, type HistoryQuery } from '../../data/load-history-filter'
import { historyCrumbs } from '../../history-crumbs/history-crumbs'
import { formatRatio } from '../../stat-format/stat-format'
import { AthleteHero } from '../athlete-hero/athlete-hero'
import { AthleteSeasonsTable } from '../athlete-seasons-table/athlete-seasons-table'
import { BackToOverviewLink } from '../back-to-overview-link/back-to-overview-link'
import { BestSeasonBanner } from '../best-season-banner/best-season-banner'
import { HistoryEmptyState } from '../history-empty-state/history-empty-state'
import { HistoryFilters } from '../history-filters/history-filters'
import { HistoryFrame } from '../history-frame/history-frame'
import { KpiGrid } from '../kpi-grid/kpi-grid'
import { SeasonBarChart } from '../season-bar-chart/season-bar-chart'

const ATHLETE_PAGE_LABEL = 'Atleta'
const GOALS_PER_GAME_DIGITS = 2
const FALLBACK_BAR_COLOR = 'var(--tx4)'

type AthleteHistoryScreenProps = { playerId: string; query: HistoryQuery }

export async function AthleteHistoryScreen({ playerId, query }: AthleteHistoryScreenProps) {
  const { filter, availableYears, seasonLabel } = await loadHistoryFilter(query)
  const history = await getAthleteHistory(playerId, filter)
  if (!history) notFound()

  const target = { kind: 'athlete', playerId } as const
  const kpis = [
    { label: 'Gols', value: String(history.goals) },
    { label: 'Jogos', value: String(history.games) },
    { label: 'Gols por jogo', value: formatRatio(history.goals, history.games, GOALS_PER_GAME_DIGITS) },
    { label: 'Temporadas', value: String(history.seasons.length) },
  ]

  return (
    <>
      <ContextBar crumbs={historyCrumbs(target, filter, seasonLabel, ATHLETE_PAGE_LABEL)} title={history.name} category={history.category ?? undefined} />
      <HistoryFrame>
        <HistoryFilters filter={filter} availableYears={availableYears} target={target} />
        <div className="flex animate-fade-in flex-col gap-[22px]">
          <BackToOverviewLink filter={filter} />
          <AthleteHero history={history} />
          <KpiGrid kpis={kpis} variant="detail" />
          {history.bestSeason ? <BestSeasonBanner season={history.bestSeason} /> : null}
          {history.seasons.length === 0 ? (
            <HistoryEmptyState message="Este atleta não tem jogos registrados nas temporadas selecionadas" />
          ) : (
            <>
              <SeasonBarChart
                title="Gols por temporada"
                bars={history.seasons.map((season) => ({ year: season.year, value: season.goals }))}
                color={history.team?.color ?? FALLBACK_BAR_COLOR}
                trackHeightClass="h-[88px]"
              />
              <AthleteSeasonsTable seasons={history.seasons} />
            </>
          )}
        </div>
      </HistoryFrame>
    </>
  )
}
