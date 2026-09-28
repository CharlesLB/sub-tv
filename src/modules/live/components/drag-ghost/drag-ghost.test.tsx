import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { homeReserveFixture, homeTeamFixture } from '../live-board/live-board.fixtures'
import { DragGhost } from './drag-ghost'

describe('DragGhost', () => {
  it('follows the pointer with the dragged player shirt number and name', () => {
    render(<DragGhost player={homeReserveFixture} teamColor={homeTeamFixture.color} clientX={120} clientY={80} hasTarget={false} />)

    expect(screen.getByText('Caio Brandão')).toBeInTheDocument()
    expect(screen.getByText('12')).toHaveStyle({ color: homeTeamFixture.color })
    expect(screen.getByText('Caio Brandão').parentElement).toHaveStyle({ left: '120px', top: '80px' })
  })

  it('stays hidden from assistive technology', () => {
    render(<DragGhost player={homeReserveFixture} teamColor={homeTeamFixture.color} clientX={0} clientY={0} hasTarget={false} />)

    expect(screen.getByText('Caio Brandão').parentElement).toHaveAttribute('aria-hidden', 'true')
  })

  it('highlights the border when the pointer is over a drop target', () => {
    render(<DragGhost player={homeReserveFixture} teamColor={homeTeamFixture.color} clientX={0} clientY={0} hasTarget />)

    expect(screen.getByText('Caio Brandão').parentElement).toHaveClass('border-az')
  })

  it('keeps the neutral border when there is no drop target', () => {
    render(<DragGhost player={homeReserveFixture} teamColor={homeTeamFixture.color} clientX={0} clientY={0} hasTarget={false} />)

    expect(screen.getByText('Caio Brandão').parentElement).toHaveClass('border-bd2')
  })
})
