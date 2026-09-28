import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { getHistoryOverview } from '../../data/get-history-overview'
import { loadHistoryFilter } from '../../data/load-history-filter'
import { loadedHistoryFilterFixture } from '../athlete-history-screen/athlete-history-screen.fixtures'
import { emptyHistoryOverviewFixture, historyOverviewFixture } from '../highlight-cards/highlight-cards.fixtures'
import { HISTORY_OVERVIEW_TITLE, HistoryOverviewScreen } from './history-overview-screen'

const renderScreen = async () => render(<Suspense>{await HistoryOverviewScreen({ query: {} })}</Suspense>)

describe('HistoryOverviewScreen', () => {
  it('shows the overview title, highlights, accumulated table and period scorers', async () => {
    vi.mocked(loadHistoryFilter).mockResolvedValue(loadedHistoryFilterFixture)
    vi.mocked(getHistoryOverview).mockResolvedValue(historyOverviewFixture)

    await renderScreen()

    expect(screen.getByRole('heading', { level: 1, name: HISTORY_OVERVIEW_TITLE })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Melhor aproveitamento/ })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Classificação acumulada por time' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Artilheiros do período' })).toBeInTheDocument()
  })

  it('summarizes championships, matches, goals and goals per game in the indicators', async () => {
    vi.mocked(loadHistoryFilter).mockResolvedValue(loadedHistoryFilterFixture)
    vi.mocked(getHistoryOverview).mockResolvedValue(historyOverviewFixture)

    await renderScreen()

    expect(screen.getByText('Campeonatos').previousElementSibling).toHaveTextContent('6')
    expect(screen.getByText('Partidas').previousElementSibling).toHaveTextContent('180')
    expect(screen.getByText('Gols por jogo').previousElementSibling).toHaveTextContent('3,0')
  })

  it('shows the empty states when the filter has no data', async () => {
    vi.mocked(loadHistoryFilter).mockResolvedValue(loadedHistoryFilterFixture)
    vi.mocked(getHistoryOverview).mockResolvedValue(emptyHistoryOverviewFixture)

    await renderScreen()

    expect(screen.getByText('Nenhuma campanha registrada para os filtros selecionados')).toBeInTheDocument()
    expect(screen.getByText('Nenhum gol registrado para os filtros selecionados')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Melhor aproveitamento/ })).not.toBeInTheDocument()
  })

  it('asks for the overview with the parsed filter', async () => {
    vi.mocked(loadHistoryFilter).mockResolvedValue(loadedHistoryFilterFixture)
    vi.mocked(getHistoryOverview).mockResolvedValue(historyOverviewFixture)

    await renderScreen()

    expect(getHistoryOverview).toHaveBeenCalledWith(loadedHistoryFilterFixture.filter)
  })
})
