import { render, screen } from '@testing-library/react'
import { ReadonlyURLSearchParams, usePathname, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { getActiveBroadcast } from '@/modules/matches/data/get-active-broadcast'
import { activeBroadcastFixture } from '../live-broadcast-chip/live-broadcast-chip.fixtures'
import { RailWithBroadcast } from './rail-with-broadcast'

vi.mock(import('next/navigation'), async (importOriginal) => ({ ...(await importOriginal()), usePathname: vi.fn(), useSearchParams: vi.fn() }))

const renderRail = async () => {
  vi.mocked(usePathname).mockReturnValue('/campeonatos')
  vi.mocked(useSearchParams).mockReturnValue(new ReadonlyURLSearchParams())

  return render(<Suspense>{await RailWithBroadcast()}</Suspense>)
}

describe('RailWithBroadcast', () => {
  it('shows the navigation without the live link when there is no broadcast', async () => {
    vi.mocked(getActiveBroadcast).mockResolvedValue(null)

    await renderRail()

    expect(screen.getByRole('navigation', { name: 'Principal' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Ao vivo' })).not.toBeInTheDocument()
  })

  it('links to the active broadcast from the navigation', async () => {
    vi.mocked(getActiveBroadcast).mockResolvedValue(activeBroadcastFixture)

    await renderRail()

    expect(screen.getByRole('link', { name: 'Ao vivo' })).toHaveAttribute('href', `/ao-vivo/${activeBroadcastFixture.matchId}`)
  })
})
