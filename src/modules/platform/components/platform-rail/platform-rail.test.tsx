import { render, screen } from '@testing-library/react'
import { ReadonlyURLSearchParams, usePathname, useSearchParams } from 'next/navigation'
import { describe, expect, it, vi } from 'vitest'
import { activeBroadcastFixture } from '../live-broadcast-chip/live-broadcast-chip.fixtures'
import { PlatformRail } from './platform-rail'

vi.mock(import('next/navigation'), async (importOriginal) => ({ ...(await importOriginal()), usePathname: vi.fn(), useSearchParams: vi.fn() }))

const arrangeLocation = (pathname: string, search = '') => {
  vi.mocked(usePathname).mockReturnValue(pathname)
  vi.mocked(useSearchParams).mockReturnValue(new ReadonlyURLSearchParams(search))
}

describe('PlatformRail', () => {
  it('links the three destinations without a season when the address has none', () => {
    arrangeLocation('/historico')

    render(<PlatformRail liveMatchId={null} />)

    expect(screen.getByRole('link', { name: 'Campeo.' })).toHaveAttribute('href', '/campeonatos')
    expect(screen.getByRole('link', { name: 'Elencos' })).toHaveAttribute('href', '/elencos')
    expect(screen.getByRole('link', { name: 'Histórico' })).toHaveAttribute('href', '/historico')
  })

  it('carries the season of the address to championships and squads but not to history', () => {
    arrangeLocation('/campeonatos', 'temporada=2025')

    render(<PlatformRail liveMatchId={null} />)

    expect(screen.getByRole('link', { name: 'Campeo.' })).toHaveAttribute('href', '/campeonatos?temporada=2025')
    expect(screen.getByRole('link', { name: 'Elencos' })).toHaveAttribute('href', '/elencos?temporada=2025')
    expect(screen.getByRole('link', { name: 'Histórico' })).toHaveAttribute('href', '/historico')
  })

  it('ignores a season in the address that is not a positive whole number', () => {
    arrangeLocation('/campeonatos', 'temporada=abc')

    render(<PlatformRail liveMatchId={null} />)

    expect(screen.getByRole('link', { name: 'Campeo.' })).toHaveAttribute('href', '/campeonatos')
  })

  it('marks the destination that starts the current path as the current page', () => {
    arrangeLocation('/elencos/2025')

    render(<PlatformRail liveMatchId={null} />)

    expect(screen.getByRole('link', { name: 'Elencos' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Campeo.' })).not.toHaveAttribute('aria-current')
  })

  it('hides the live link when there is no broadcast', () => {
    arrangeLocation('/campeonatos')

    render(<PlatformRail liveMatchId={null} />)

    expect(screen.queryByRole('link', { name: 'Ao vivo' })).not.toBeInTheDocument()
  })

  it('links back to the live broadcast and marks it current while on a live page', () => {
    arrangeLocation(`/ao-vivo/${activeBroadcastFixture.matchId}`)

    render(<PlatformRail liveMatchId={activeBroadcastFixture.matchId} />)

    const liveLink = screen.getByRole('link', { name: 'Ao vivo' })
    expect(liveLink).toHaveAttribute('href', `/ao-vivo/${activeBroadcastFixture.matchId}`)
    expect(liveLink).toHaveAttribute('aria-current', 'page')
  })

  it('does not mark the live link current while on another page', () => {
    arrangeLocation('/campeonatos')

    render(<PlatformRail liveMatchId={activeBroadcastFixture.matchId} />)

    expect(screen.getByRole('link', { name: 'Ao vivo' })).not.toHaveAttribute('aria-current')
  })
})
