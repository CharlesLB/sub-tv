import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SeasonPanel } from './season-panel'
import { ACTIVE_YEAR_FIXTURE, championshipsHrefForYear, seasonYearsFixture } from './season-panel.fixtures'

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const renderPanel = (onSelectYear = vi.fn()) => render(<SeasonPanel years={seasonYearsFixture} activeYear={ACTIVE_YEAR_FIXTURE} hrefForYear={championshipsHrefForYear} onSelectYear={onSelectYear} />)

describe('SeasonPanel', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', ResizeObserverStub)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('starts closed showing only the seasons button', () => {
    renderPanel()

    expect(screen.getByRole('button', { name: 'Todas as temporadas' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('Temporadas')).not.toBeInTheDocument()
  })

  it('lists every season with its championship count and link when the button is clicked', async () => {
    renderPanel()

    await userEvent.click(screen.getByRole('button', { name: 'Todas as temporadas' }))

    expect(screen.getByText('Elenco próprio por ano')).toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(seasonYearsFixture.length)
    expect(screen.getByRole('link', { name: '2023 3 Camp.' })).toHaveAttribute('href', '/campeonatos?temporada=2023')
  })

  it('names the open panel after its heading', async () => {
    renderPanel()

    await userEvent.click(screen.getByRole('button', { name: 'Todas as temporadas' }))

    expect(screen.getByRole('dialog', { name: 'Temporadas' })).toBeInTheDocument()
  })

  it('marks only the active season as current', async () => {
    renderPanel()

    await userEvent.click(screen.getByRole('button', { name: 'Todas as temporadas' }))

    expect(screen.getByRole('link', { name: '2025 4 Camp.' })).toHaveAttribute('aria-current', 'true')
    expect(screen.getByRole('link', { name: '2024 5 Camp.' })).not.toHaveAttribute('aria-current')
  })

  it('reports the chosen season and closes when a season is clicked', async () => {
    const onSelectYear = vi.fn()
    renderPanel(onSelectYear)
    await userEvent.click(screen.getByRole('button', { name: 'Todas as temporadas' }))

    await userEvent.click(screen.getByRole('link', { name: '2022 4 Camp.' }))

    expect(onSelectYear).toHaveBeenCalledWith(2022)
    expect(screen.queryByText('Elenco próprio por ano')).not.toBeInTheDocument()
  })
})
