import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Suspense } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { closeBroadcast } from '@/modules/matches/actions/broadcast-actions'
import { getActiveBroadcast } from '@/modules/matches/data/get-active-broadcast'
import { LiveBroadcastChip } from './live-broadcast-chip'
import { activeBroadcastFixture } from './live-broadcast-chip.fixtures'

vi.mock('next/navigation', () => ({ usePathname: vi.fn(() => '/campeonatos') }))

const renderChip = async () => render(<Suspense>{await LiveBroadcastChip()}</Suspense>)

describe('LiveBroadcastChip', () => {
  it('renders nothing when there is no active broadcast', async () => {
    vi.mocked(getActiveBroadcast).mockResolvedValue(null)

    const { container } = await renderChip()

    expect(container).toBeEmptyDOMElement()
  })

  it('shows the home and away teams of the active broadcast linked to the live page', async () => {
    vi.mocked(getActiveBroadcast).mockResolvedValue(activeBroadcastFixture)

    await renderChip()

    expect(screen.getByRole('link', { name: 'Atlético Serrano × União Ribeirinha' })).toHaveAttribute('href', `/ao-vivo/${activeBroadcastFixture.matchId}`)
  })

  it('closes the active broadcast by its match id when the close button is clicked', async () => {
    vi.mocked(getActiveBroadcast).mockResolvedValue(activeBroadcastFixture)
    vi.mocked(closeBroadcast).mockResolvedValue(undefined)
    await renderChip()

    await userEvent.click(screen.getByRole('button', { name: 'Fechar transmissão' }))

    expect(closeBroadcast).toHaveBeenCalledWith(activeBroadcastFixture.matchId, expect.any(FormData))
  })
})
