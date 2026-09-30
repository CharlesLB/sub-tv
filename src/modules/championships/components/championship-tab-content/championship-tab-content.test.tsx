import { render, screen } from '@testing-library/react'
import { cloneElement, isValidElement, type ReactNode, Suspense } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { getSeasonMatches } from '../../data/get-season-matches'
import { getStandings } from '../../data/get-standings'
import { getTopScorers } from '../../data/get-top-scorers'
import { CHAMPIONSHIP_TAB, type ChampionshipTab } from '../../lib/championship-tab/championship-tab'
import { seasonMatchesFixture } from '../round-panel/round-panel.fixtures'
import { singlePhaseFixture } from '../standings-panel/standings-panel.fixtures'
import { topScorersFixture } from '../top-scorers-table/top-scorers-table.fixtures'
import { ChampionshipTabContent } from './championship-tab-content'
import { championshipHeaderFixture } from './championship-tab-content.fixtures'

const ASYNC_FUNCTION_NAME = 'AsyncFunction'

const isAsyncComponent = (type: unknown): type is (props: unknown) => Promise<ReactNode> => typeof type === 'function' && type.constructor.name === ASYNC_FUNCTION_NAME

const resolveAsyncComponents = async (node: ReactNode): Promise<ReactNode> => {
  if (!isValidElement<{ children?: ReactNode }>(node)) return node
  if (isAsyncComponent(node.type)) return resolveAsyncComponents(await node.type(node.props))
  if (node.props.children === undefined) return node

  return cloneElement(node, undefined, await resolveAsyncComponents(node.props.children))
}

const renderTab = async (tab: ChampionshipTab) => render(<Suspense>{await resolveAsyncComponents(ChampionshipTabContent({ header: championshipHeaderFixture, tab }))}</Suspense>)

describe('ChampionshipTabContent', () => {
  it('shows the standings and the current round of the season on the standings tab', async () => {
    vi.mocked(getStandings).mockResolvedValue(singlePhaseFixture)
    vi.mocked(getSeasonMatches).mockResolvedValue(seasonMatchesFixture)

    await renderTab(CHAMPIONSHIP_TAB.STANDINGS)

    expect(screen.getByText('Classificação')).toBeInTheDocument()
    expect(screen.getByText('Após 3 Rodadas')).toBeInTheDocument()
    expect(screen.getByText('Rodada 3')).toBeInTheDocument()
    expect(getStandings).toHaveBeenCalledWith(championshipHeaderFixture.id)
  })

  it('shows the top scorers of the season on the statistics tab', async () => {
    vi.mocked(getTopScorers).mockResolvedValue(topScorersFixture)

    await renderTab(CHAMPIONSHIP_TAB.STATISTICS)

    expect(screen.getByText('Artilharia')).toBeInTheDocument()
    expect(getTopScorers).toHaveBeenCalledWith(championshipHeaderFixture.id)
  })

  it('shows every match of the season on the matches tab', async () => {
    vi.mocked(getSeasonMatches).mockResolvedValue(seasonMatchesFixture)

    await renderTab(CHAMPIONSHIP_TAB.MATCHES)

    expect(screen.getByText('Partidas')).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(seasonMatchesFixture.length)
  })
})
