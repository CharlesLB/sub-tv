import { render, screen } from '@testing-library/react'
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { activeChampionshipIdFixture, championshipRibbonFixture } from '../championship-ribbon/championship-ribbon.fixtures'
import { ACTIVE_YEAR_FIXTURE, seasonYearsFixture } from '../season-panel/season-panel.fixtures'
import { SeasonRail } from './season-rail'

vi.mock(import('next/navigation'), async (importOriginal) => ({ ...(await importOriginal()), usePathname: vi.fn(), useRouter: vi.fn(), useSearchParams: vi.fn() }))

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const SEASON_STORAGE_KEY = 'futebol-temporada'

const arrangeLocation = (pathname: string, search = '') => {
  const replace = vi.fn()
  vi.mocked(usePathname).mockReturnValue(pathname)
  vi.mocked(useSearchParams).mockReturnValue(new ReadonlyURLSearchParams(search))
  vi.mocked(useRouter).mockReturnValue({ back: vi.fn(), forward: vi.fn(), refresh: vi.fn(), push: vi.fn(), replace, prefetch: vi.fn(), bfcacheId: 'season-rail' })

  return replace
}

describe('SeasonRail', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', ResizeObserverStub)
    vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    localStorage.clear()
  })

  it('shows the seasons button, the year axis and the championship ribbon', () => {
    arrangeLocation('/campeonatos', 'temporada=2025')

    render(
      <SeasonRail years={seasonYearsFixture} activeYear={ACTIVE_YEAR_FIXTURE} championships={championshipRibbonFixture} activeChampionshipId={activeChampionshipIdFixture} basePath="/campeonatos" />,
    )

    expect(screen.getByRole('button', { name: 'Todas as temporadas' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '2025' })).toHaveAttribute('aria-current', 'true')
    expect(screen.getByRole('link', { name: /Mineiro Sub-14/ })).toHaveAttribute('aria-current', 'page')
  })

  it('links each year to the championships page without other parameters', () => {
    arrangeLocation('/campeonatos', 'temporada=2025&cat=sub13')

    render(<SeasonRail years={seasonYearsFixture} activeYear={ACTIVE_YEAR_FIXTURE} championships={championshipRibbonFixture} basePath="/campeonatos" />)

    expect(screen.getByRole('link', { name: '2024' })).toHaveAttribute('href', '/campeonatos?temporada=2024')
  })

  it('keeps the category of the address in the year links of the squads page', () => {
    arrangeLocation('/elencos/2025', 'cat=sub13&time=cru')

    render(<SeasonRail years={seasonYearsFixture} activeYear={ACTIVE_YEAR_FIXTURE} championships={championshipRibbonFixture} basePath="/elencos" />)

    expect(screen.getByRole('link', { name: '2024' })).toHaveAttribute('href', '/elencos/2024?cat=sub13')
  })

  it('opens the remembered season when the address has no season', () => {
    localStorage.setItem(SEASON_STORAGE_KEY, '2023')
    const replace = arrangeLocation('/campeonatos')

    render(<SeasonRail years={seasonYearsFixture} activeYear={ACTIVE_YEAR_FIXTURE} championships={championshipRibbonFixture} basePath="/campeonatos" />)

    expect(replace).toHaveBeenCalledWith('/campeonatos?temporada=2023')
  })

  it('keeps the season of the address even when another season is remembered', () => {
    localStorage.setItem(SEASON_STORAGE_KEY, '2023')
    const replace = arrangeLocation('/campeonatos', 'temporada=2025')

    render(<SeasonRail years={seasonYearsFixture} activeYear={ACTIVE_YEAR_FIXTURE} championships={championshipRibbonFixture} basePath="/campeonatos" />)

    expect(replace).not.toHaveBeenCalled()
  })

  it('ignores a remembered season that is not in the list', () => {
    localStorage.setItem(SEASON_STORAGE_KEY, '2010')
    const replace = arrangeLocation('/campeonatos')

    render(<SeasonRail years={seasonYearsFixture} activeYear={ACTIVE_YEAR_FIXTURE} championships={championshipRibbonFixture} basePath="/campeonatos" />)

    expect(replace).not.toHaveBeenCalled()
  })

  it('reads the remembered season only once when the rail renders again with the same address', () => {
    arrangeLocation('/campeonatos')
    const readStorage = vi.spyOn(Storage.prototype, 'getItem')
    const { rerender } = render(<SeasonRail years={seasonYearsFixture} activeYear={ACTIVE_YEAR_FIXTURE} championships={championshipRibbonFixture} basePath="/campeonatos" />)

    rerender(<SeasonRail years={seasonYearsFixture} activeYear={ACTIVE_YEAR_FIXTURE} championships={championshipRibbonFixture} basePath="/campeonatos" />)

    expect(readStorage.mock.calls.filter(([key]) => key === SEASON_STORAGE_KEY)).toHaveLength(1)
    readStorage.mockRestore()
  })

  it('does not redirect on a page below the base path', () => {
    localStorage.setItem(SEASON_STORAGE_KEY, '2023')
    const replace = arrangeLocation(`/campeonatos/${activeChampionshipIdFixture}`)

    render(<SeasonRail years={seasonYearsFixture} activeYear={ACTIVE_YEAR_FIXTURE} championships={championshipRibbonFixture} basePath="/campeonatos" />)

    expect(replace).not.toHaveBeenCalled()
  })
})
