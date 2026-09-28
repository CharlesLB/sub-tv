import type { ReactNode } from 'react'
import { CHAMPIONSHIP_TAB, type ChampionshipTab } from '../../championship-tab'
import { getSeasonMatches } from '../../data/get-season-matches'
import { getStandings } from '../../data/get-standings'
import { getTopScorers } from '../../data/get-top-scorers'
import { summarizeSeasonMatches } from '../../season-summary/season-summary'
import type { ChampionshipHeaderVM } from '../../types'
import { MatchGrid } from '../match-grid/match-grid'
import { RoundPanel } from '../round-panel/round-panel'
import { StandingsPanel } from '../standings-panel/standings-panel'
import { TopScorersTable } from '../top-scorers-table/top-scorers-table'

type TabRendererProps = { header: ChampionshipHeaderVM }

async function StandingsTab({ header }: TabRendererProps) {
  const [phases, matches] = await Promise.all([getStandings(header.id), getSeasonMatches(header.id)])
  const summary = summarizeSeasonMatches(matches)

  return (
    <div className="flex animate-fade-up flex-wrap items-start gap-[18px]">
      <StandingsPanel phases={phases} category={header.category} roundsPlayed={summary.currentRound} />
      <RoundPanel seasonId={header.id} matches={matches} currentRound={summary.currentRound} currentPhase={summary.currentPhase} />
    </div>
  )
}

async function StatisticsTab({ header }: TabRendererProps) {
  return <TopScorersTable scorers={await getTopScorers(header.id)} category={header.category} />
}

async function MatchesTab({ header }: TabRendererProps) {
  return <MatchGrid matches={await getSeasonMatches(header.id)} seasonId={header.id} category={header.category} />
}

const TAB_RENDERERS: Record<ChampionshipTab, (props: TabRendererProps) => Promise<ReactNode>> = {
  [CHAMPIONSHIP_TAB.STANDINGS]: StandingsTab,
  [CHAMPIONSHIP_TAB.STATISTICS]: StatisticsTab,
  [CHAMPIONSHIP_TAB.MATCHES]: MatchesTab,
}

type ChampionshipTabContentProps = { header: ChampionshipHeaderVM; tab: ChampionshipTab }

export function ChampionshipTabContent({ header, tab }: ChampionshipTabContentProps) {
  const TabRenderer = TAB_RENDERERS[tab]

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-5 mobile:px-3 mobile:pt-[14px] mobile:pb-[26px]">
      <div className="mx-auto max-w-[1280px]">
        <TabRenderer header={header} />
      </div>
    </div>
  )
}
