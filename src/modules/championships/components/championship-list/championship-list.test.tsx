import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { liveChampionshipFixture } from '../championship-card/championship-card.fixtures'
import { categoryClubsFixture } from '../club-picker/club-picker.fixtures'
import { ChampionshipList } from './championship-list'
import { championshipsOfYearFixture, SEASON_YEAR_FIXTURE } from './championship-list.fixtures'

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))

describe('ChampionshipList', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn()
  })

  it('splits the championships in one column per category with their totals', () => {
    render(<ChampionshipList championships={championshipsOfYearFixture} year={SEASON_YEAR_FIXTURE} clubs={categoryClubsFixture} canEdit={false} />)

    const sub13Column = within(screen.getByRole('region', { name: 'Campeonatos SUB-13' }))
    const sub14Column = within(screen.getByRole('region', { name: 'Campeonatos SUB-14' }))
    expect(sub13Column.getByText('3 campeonatos · 16 times · 320 atletas')).toBeInTheDocument()
    expect(sub13Column.getByText('Copa do Vale')).toBeInTheDocument()
    expect(sub14Column.getByText('1 campeonato · 6 times · 120 atletas')).toBeInTheDocument()
    expect(sub14Column.getByText('Taça das Serras')).toBeInTheDocument()
  })

  it('shows the empty message in a category without championships', () => {
    render(<ChampionshipList championships={[liveChampionshipFixture]} year={SEASON_YEAR_FIXTURE} clubs={categoryClubsFixture} canEdit={false} />)

    const sub13Column = within(screen.getByRole('region', { name: 'Campeonatos SUB-13' }))
    expect(sub13Column.getByText('0 campeonatos · 0 times · 0 atletas')).toBeInTheDocument()
    expect(sub13Column.getByText('Nenhum campeonato nesta temporada')).toBeInTheDocument()
  })

  it('hides the new championship buttons from visitors who cannot edit', () => {
    render(<ChampionshipList championships={championshipsOfYearFixture} year={SEASON_YEAR_FIXTURE} clubs={categoryClubsFixture} canEdit={false} />)

    expect(screen.queryByRole('button', { name: /Novo campeonato/ })).not.toBeInTheDocument()
  })

  it('opens the new championship form from a category column when the visitor can edit', async () => {
    render(<ChampionshipList championships={championshipsOfYearFixture} year={SEASON_YEAR_FIXTURE} clubs={categoryClubsFixture} canEdit />)

    await userEvent.click(screen.getByRole('button', { name: 'Novo campeonato SUB-13' }))

    expect(screen.getByRole('heading', { name: 'Novo campeonato' })).toBeInTheDocument()
    expect(screen.getByLabelText('Temporada')).toHaveValue(SEASON_YEAR_FIXTURE)
  })
})
