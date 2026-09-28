import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { usePathname } from 'next/navigation'
import { describe, expect, it, vi } from 'vitest'
import { activeBroadcastFixture } from '../live-broadcast-chip/live-broadcast-chip.fixtures'
import { LiveChip } from './live-chip'
import { liveChipStyles } from './live-chip.styles'

vi.mock('next/navigation', () => ({ usePathname: vi.fn() }))

const LIVE_PATH = `/ao-vivo/${activeBroadcastFixture.matchId}`
const MATCHUP = 'Atlético Serrano × União Ribeirinha'

describe('LiveChip', () => {
  it('links the matchup back to the live broadcast', () => {
    vi.mocked(usePathname).mockReturnValue('/campeonatos')

    render(<LiveChip matchId={activeBroadcastFixture.matchId} matchup={MATCHUP} closeBroadcast={vi.fn()} />)

    expect(screen.getByRole('link', { name: MATCHUP })).toHaveAttribute('href', LIVE_PATH)
  })

  it('uses the idle look when the operator is on another page', () => {
    vi.mocked(usePathname).mockReturnValue('/campeonatos')

    render(<LiveChip matchId={activeBroadcastFixture.matchId} matchup={MATCHUP} closeBroadcast={vi.fn()} />)

    expect(screen.getByRole('link', { name: MATCHUP })).toHaveClass(liveChipStyles.linkElsewhere)
  })

  it('highlights the chip when the operator is already on the live broadcast', () => {
    vi.mocked(usePathname).mockReturnValue(LIVE_PATH)

    render(<LiveChip matchId={activeBroadcastFixture.matchId} matchup={MATCHUP} closeBroadcast={vi.fn()} />)

    expect(screen.getByRole('link', { name: MATCHUP })).toHaveClass(liveChipStyles.linkOnLive)
  })

  it('submits the close broadcast action when the close button is clicked', async () => {
    vi.mocked(usePathname).mockReturnValue('/campeonatos')
    const closeBroadcast = vi.fn(() => Promise.resolve())
    render(<LiveChip matchId={activeBroadcastFixture.matchId} matchup={MATCHUP} closeBroadcast={closeBroadcast} />)

    await userEvent.click(screen.getByRole('button', { name: 'Fechar transmissão' }))

    expect(closeBroadcast).toHaveBeenCalledOnce()
  })
})
