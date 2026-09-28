import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { getTeamHistory } from '../../data/get-team-history'
import { loadHistoryFilter } from '../../data/load-history-filter'
import { loadedHistoryFilterFixture } from '../athlete-history-screen/athlete-history-screen.fixtures'
import { teamHistoryFixture, teamWithoutSeasonsFixture } from '../team-hero/team-hero.fixtures'
import { TeamHistoryScreen } from './team-history-screen'

const screenProps = { teamKey: teamHistoryFixture.teamKey, query: {} }

const renderScreen = async () => render(<Suspense>{await TeamHistoryScreen(screenProps)}</Suspense>)

describe('TeamHistoryScreen', () => {
  it('shows the team and category as the page title with the points per season chart', async () => {
    vi.mocked(loadHistoryFilter).mockResolvedValue(loadedHistoryFilterFixture)
    vi.mocked(getTeamHistory).mockResolvedValue(teamHistoryFixture)

    await renderScreen()

    expect(screen.getByRole('heading', { level: 1, name: 'Cruzeiro SUB-14' })).toBeInTheDocument()
    expect(screen.getByRole('figure', { name: 'Pontos por temporada' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Campanha por temporada' })).toBeInTheDocument()
  })

  it('summarizes points, win rate, goal difference and record in the indicators', async () => {
    vi.mocked(loadHistoryFilter).mockResolvedValue(loadedHistoryFilterFixture)
    vi.mocked(getTeamHistory).mockResolvedValue(teamHistoryFixture)

    await renderScreen()

    expect(screen.getByText('Saldo de gols').previousElementSibling).toHaveTextContent('+47')
    expect(screen.getByText('V · E · D').previousElementSibling).toHaveTextContent('18·4·2')
  })

  it('shows the empty states when the team did not play in the selected seasons', async () => {
    vi.mocked(loadHistoryFilter).mockResolvedValue(loadedHistoryFilterFixture)
    vi.mocked(getTeamHistory).mockResolvedValue(teamWithoutSeasonsFixture)

    await renderScreen()

    expect(screen.getByText('Este time não disputou campeonatos nas temporadas selecionadas')).toBeInTheDocument()
    expect(screen.queryByRole('figure', { name: 'Pontos por temporada' })).not.toBeInTheDocument()
    expect(screen.getByText('Nenhum gol do time nos filtros selecionados')).toBeInTheDocument()
    expect(screen.getByText('Nenhuma participação nos filtros selecionados')).toBeInTheDocument()
  })

  it('asks for the history of the requested team with the parsed filter', async () => {
    vi.mocked(loadHistoryFilter).mockResolvedValue(loadedHistoryFilterFixture)
    vi.mocked(getTeamHistory).mockResolvedValue(teamHistoryFixture)

    await renderScreen()

    expect(getTeamHistory).toHaveBeenCalledWith(teamHistoryFixture.teamKey, loadedHistoryFilterFixture.filter)
  })

  it('fails with not found when the team does not exist', async () => {
    vi.mocked(loadHistoryFilter).mockResolvedValue(loadedHistoryFilterFixture)
    vi.mocked(getTeamHistory).mockResolvedValue(null)

    const pendingScreen = TeamHistoryScreen(screenProps)

    await expect(pendingScreen).rejects.toThrow()
  })
})
