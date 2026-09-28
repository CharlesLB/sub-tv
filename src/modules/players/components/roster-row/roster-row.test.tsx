import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RosterRow } from './roster-row'
import { squadPlayerFixture, squadPlayerWithoutDetailsFixture } from './roster-row.fixtures'

const PLAYER_HREF = '/elencos?atleta=5a8c2e14'
const TEAM_COLOR = '#1f4fa3'

describe('RosterRow', () => {
  it('shows the number, roster name, position, games, goals and curiosity count', () => {
    render(<RosterRow player={squadPlayerFixture} index={0} href={PLAYER_HREF} teamColor={TEAM_COLOR} isSelected={false} onSelect={vi.fn()} />)

    const row = screen.getByRole('link')
    expect(row).toHaveAttribute('href', PLAYER_HREF)
    expect(row).toHaveTextContent('10Rafael Moreira Duarte "Rafinha"MeiaMei1272')
    expect(screen.getByText('10')).toHaveStyle({ color: TEAM_COLOR })
    expect(row).not.toHaveAttribute('aria-current')
  })

  it('shows dashes for the missing number, position and curiosities', () => {
    render(<RosterRow player={squadPlayerWithoutDetailsFixture} index={3} href={PLAYER_HREF} teamColor={TEAM_COLOR} isSelected={false} onSelect={vi.fn()} />)

    expect(screen.getAllByText('—')).toHaveLength(4)
    expect(screen.getByText('Tiago Pereira Lopes')).toBeInTheDocument()
  })

  it('marks the row as current when the player is selected', () => {
    render(<RosterRow player={squadPlayerFixture} index={0} href={PLAYER_HREF} teamColor={TEAM_COLOR} isSelected onSelect={vi.fn()} />)

    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'true')
  })

  it('selects the player instead of navigating on a plain click', async () => {
    const onSelect = vi.fn()
    render(<RosterRow player={squadPlayerFixture} index={0} href={PLAYER_HREF} teamColor={TEAM_COLOR} isSelected={false} onSelect={onSelect} />)

    await userEvent.click(screen.getByRole('link'))

    expect(onSelect).toHaveBeenCalledWith(squadPlayerFixture.id)
  })

  it('leaves a modified click to the browser without selecting the player', () => {
    const onSelect = vi.fn()
    render(<RosterRow player={squadPlayerFixture} index={0} href={PLAYER_HREF} teamColor={TEAM_COLOR} isSelected={false} onSelect={onSelect} />)

    const wasNotPrevented = fireEvent.click(screen.getByRole('link'), { ctrlKey: true })

    expect(wasNotPrevented).toBe(true)
    expect(onSelect).not.toHaveBeenCalled()
  })
})
