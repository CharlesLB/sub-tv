import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { homeTeamFixture } from '../live-board/live-board.fixtures'
import { EventChip } from './event-chip'
import { goalItemFixture, halfTimeItemFixture } from './event-chip.fixtures'

describe('EventChip', () => {
  it('shows the minute label and the event description', () => {
    render(<EventChip item={goalItemFixture} teamColor={homeTeamFixture.color} isNewest={false} />)

    expect(screen.getByText("1ºT 12'")).toBeInTheDocument()
    expect(screen.getByText('GOL — #9 Davi · ASSIST. #10 Heitor')).toBeInTheDocument()
  })

  it('animates the entry when it is the newest event', () => {
    render(<EventChip item={goalItemFixture} teamColor={homeTeamFixture.color} isNewest />)

    expect(screen.getByText('GOL — #9 Davi · ASSIST. #10 Heitor').parentElement).toHaveClass('animate-event-in')
  })

  it('does not animate an older event', () => {
    render(<EventChip item={halfTimeItemFixture} teamColor={null} isNewest={false} />)

    expect(screen.getByText('Intervalo').parentElement).not.toHaveClass('animate-event-in')
  })
})
