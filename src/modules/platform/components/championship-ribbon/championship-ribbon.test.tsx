import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ChampionshipRibbon } from './championship-ribbon'
import { activeChampionshipIdFixture, championshipRibbonFixture } from './championship-ribbon.fixtures'

class ResizeObserverStub {
  observe() {}
  disconnect() {}
}

const stubRibbonScroll = ({ scrollLeft, clientWidth, scrollWidth }: { scrollLeft: number; clientWidth: number; scrollWidth: number }) => {
  vi.spyOn(HTMLElement.prototype, 'scrollLeft', 'get').mockReturnValue(scrollLeft)
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(clientWidth)
  vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(scrollWidth)
}

describe('ChampionshipRibbon', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', ResizeObserverStub)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('links each championship to its page with its category and last activity', () => {
    render(<ChampionshipRibbon championships={championshipRibbonFixture} activeChampionshipId={null} />)

    const link = screen.getByRole('link', { name: /Mineiro Sub-13/ })
    expect(link).toHaveAttribute('href', '/campeonatos/0b6f3f0e-6c1a-4c55-9a51-1f0d2b3c4d02')
    expect(link).toHaveTextContent('Mineiro Sub-13SUB-13SET 2024')
    expect(screen.getAllByRole('link')).toHaveLength(championshipRibbonFixture.length)
  })

  it('leaves the last activity blank when the championship has none', () => {
    render(<ChampionshipRibbon championships={championshipRibbonFixture} activeChampionshipId={null} />)

    expect(screen.getByRole('link', { name: /Taça Serra Azul/ }).textContent).toBe('Taça Serra Azul Sub-14SUB-14')
  })

  it('marks only the active championship as the current page', () => {
    render(<ChampionshipRibbon championships={championshipRibbonFixture} activeChampionshipId={activeChampionshipIdFixture} />)

    expect(screen.getByRole('link', { name: /Mineiro Sub-14/ })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: /Mineiro Sub-13/ })).not.toHaveAttribute('aria-current')
  })

  it('hides both scroll arrows when every championship fits', () => {
    stubRibbonScroll({ scrollLeft: 0, clientWidth: 800, scrollWidth: 800 })

    render(<ChampionshipRibbon championships={championshipRibbonFixture} activeChampionshipId={null} />)

    expect(screen.queryByRole('button', { name: 'Campeonatos anteriores' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Mais campeonatos' })).not.toBeInTheDocument()
  })

  it('shows both scroll arrows when the ribbon is scrolled into the middle', () => {
    stubRibbonScroll({ scrollLeft: 100, clientWidth: 300, scrollWidth: 1000 })

    render(<ChampionshipRibbon championships={championshipRibbonFixture} activeChampionshipId={null} />)

    expect(screen.getByRole('button', { name: 'Campeonatos anteriores' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mais campeonatos' })).toBeInTheDocument()
  })

  it('scrolls forward by seventy percent of the visible width when the forward arrow is clicked', async () => {
    stubRibbonScroll({ scrollLeft: 0, clientWidth: 300, scrollWidth: 1000 })
    const scrollBy = vi.fn()
    HTMLElement.prototype.scrollBy = scrollBy
    render(<ChampionshipRibbon championships={championshipRibbonFixture} activeChampionshipId={null} />)

    await userEvent.click(screen.getByRole('button', { name: 'Mais campeonatos' }))

    expect(scrollBy).toHaveBeenCalledWith({ left: 210, behavior: 'smooth' })
  })

  it('scrolls back by at least the minimum step when the back arrow is clicked on a narrow ribbon', async () => {
    stubRibbonScroll({ scrollLeft: 100, clientWidth: 100, scrollWidth: 1000 })
    const scrollBy = vi.fn()
    HTMLElement.prototype.scrollBy = scrollBy
    render(<ChampionshipRibbon championships={championshipRibbonFixture} activeChampionshipId={null} />)

    await userEvent.click(screen.getByRole('button', { name: 'Campeonatos anteriores' }))

    expect(scrollBy).toHaveBeenCalledWith({ left: -180, behavior: 'smooth' })
  })
})
