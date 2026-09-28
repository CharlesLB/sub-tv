import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { getAthleteHistory } from '../../data/get-athlete-history'
import { loadHistoryFilter } from '../../data/load-history-filter'
import { athleteHistoryFixture } from '../athlete-hero/athlete-hero.fixtures'
import { AthleteHistoryScreen } from './athlete-history-screen'
import { loadedHistoryFilterFixture } from './athlete-history-screen.fixtures'

const renderScreen = async () => render(<Suspense>{await AthleteHistoryScreen({ playerId: athleteHistoryFixture.playerId, query: {} })}</Suspense>)

describe('AthleteHistoryScreen', () => {
  it('shows the athlete name as the page title and the goals per season chart', async () => {
    vi.mocked(loadHistoryFilter).mockResolvedValue(loadedHistoryFilterFixture)
    vi.mocked(getAthleteHistory).mockResolvedValue(athleteHistoryFixture)

    await renderScreen()

    expect(screen.getByRole('heading', { level: 1, name: 'Lucas Andrade' })).toBeInTheDocument()
    expect(screen.getByText('Gols por temporada')).toBeInTheDocument()
  })

  it('shows the empty state when the athlete has no games in the selected seasons', async () => {
    vi.mocked(loadHistoryFilter).mockResolvedValue(loadedHistoryFilterFixture)
    vi.mocked(getAthleteHistory).mockResolvedValue({ ...athleteHistoryFixture, seasons: [], bestSeason: null })

    await renderScreen()

    expect(screen.getByText('Este atleta não tem jogos registrados nas temporadas selecionadas')).toBeInTheDocument()
    expect(screen.queryByText('Gols por temporada')).not.toBeInTheDocument()
  })

  it('asks for the history of the requested athlete with the parsed filter', async () => {
    vi.mocked(loadHistoryFilter).mockResolvedValue(loadedHistoryFilterFixture)
    vi.mocked(getAthleteHistory).mockResolvedValue(athleteHistoryFixture)

    await renderScreen()

    expect(getAthleteHistory).toHaveBeenCalledWith(athleteHistoryFixture.playerId, loadedHistoryFilterFixture.filter)
  })
})
