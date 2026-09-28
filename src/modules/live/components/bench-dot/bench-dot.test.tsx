import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { homeReserveFixture, homeTeamFixture } from '../live-board/live-board.fixtures'
import { BenchDot } from './bench-dot'
import { reserveMatchStateFixture, subbedOutMatchStateFixture } from './bench-dot.fixtures'

const makeHandlers = () => ({ onPointerDown: vi.fn(), onHoverStart: vi.fn(), onHoverEnd: vi.fn(), onKeyboardActivate: vi.fn() })

const AVAILABLE_LABEL = 'Reserva camisa 12 — Caio Brandão'
const SUBBED_OUT_LABEL = 'Reserva camisa 12 — Caio Brandão (substituído)'

describe('BenchDot', () => {
  it('shows an available reserve with shirt number and short name', () => {
    render(<BenchDot player={homeReserveFixture} matchState={reserveMatchStateFixture} teamColor={homeTeamFixture.color} isDragged={false} isHighlighted={false} {...makeHandlers()} />)

    expect(screen.getByRole('button', { name: AVAILABLE_LABEL })).toHaveAttribute('aria-disabled', 'false')
    expect(screen.getByText('Caio')).toHaveClass('text-tx2')
    expect(screen.getByText('12').parentElement).toHaveStyle({ background: homeTeamFixture.color })
  })

  it('marks a substituted reserve as disabled and drops the team color', () => {
    render(<BenchDot player={homeReserveFixture} matchState={subbedOutMatchStateFixture} teamColor={homeTeamFixture.color} isDragged={false} isHighlighted {...makeHandlers()} />)

    expect(screen.getByRole('button', { name: SUBBED_OUT_LABEL })).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByText('12').parentElement).not.toHaveAttribute('style')
    expect(screen.getByText('12').parentElement).not.toHaveClass('shadow-[0_0_0_2px_var(--az)]')
  })

  it('rings the dot when the reserve is highlighted for a pending substitution', () => {
    render(<BenchDot player={homeReserveFixture} matchState={reserveMatchStateFixture} teamColor={homeTeamFixture.color} isDragged={false} isHighlighted {...makeHandlers()} />)

    expect(screen.getByText('12').parentElement).toHaveClass('shadow-[0_0_0_2px_var(--az)]')
  })

  it('fades the button and outlines the dot while it is dragged', () => {
    render(<BenchDot player={homeReserveFixture} matchState={reserveMatchStateFixture} teamColor={homeTeamFixture.color} isDragged isHighlighted={false} {...makeHandlers()} />)

    expect(screen.getByRole('button', { name: AVAILABLE_LABEL })).toHaveClass('opacity-50')
    expect(screen.getByText('12').parentElement).toHaveClass('border-tx')
  })

  it('activates the reserve when clicked from the keyboard', () => {
    const handlers = makeHandlers()
    render(<BenchDot player={homeReserveFixture} matchState={reserveMatchStateFixture} teamColor={homeTeamFixture.color} isDragged={false} isHighlighted={false} {...handlers} />)

    fireEvent.click(screen.getByRole('button', { name: AVAILABLE_LABEL }), { detail: 0 })

    expect(handlers.onKeyboardActivate).toHaveBeenCalledWith(homeReserveFixture.playerId)
  })

  it('ignores a pointer click because the gesture handles it', async () => {
    const handlers = makeHandlers()
    render(<BenchDot player={homeReserveFixture} matchState={reserveMatchStateFixture} teamColor={homeTeamFixture.color} isDragged={false} isHighlighted={false} {...handlers} />)

    await userEvent.click(screen.getByRole('button', { name: AVAILABLE_LABEL }))

    expect(handlers.onKeyboardActivate).not.toHaveBeenCalled()
    expect(handlers.onPointerDown).toHaveBeenCalledWith(homeReserveFixture.playerId, expect.anything())
  })

  it('does not activate a substituted reserve from the keyboard', () => {
    const handlers = makeHandlers()
    render(<BenchDot player={homeReserveFixture} matchState={subbedOutMatchStateFixture} teamColor={homeTeamFixture.color} isDragged={false} isHighlighted={false} {...handlers} />)

    fireEvent.click(screen.getByRole('button', { name: SUBBED_OUT_LABEL }), { detail: 0 })

    expect(handlers.onKeyboardActivate).not.toHaveBeenCalled()
  })

  it('reports hover start and end with the player id', async () => {
    const handlers = makeHandlers()
    render(<BenchDot player={homeReserveFixture} matchState={reserveMatchStateFixture} teamColor={homeTeamFixture.color} isDragged={false} isHighlighted={false} {...handlers} />)
    const button = screen.getByRole('button', { name: AVAILABLE_LABEL })

    await userEvent.hover(button)
    await userEvent.unhover(button)

    expect(handlers.onHoverStart).toHaveBeenCalledWith(homeReserveFixture.playerId, button)
    expect(handlers.onHoverEnd).toHaveBeenCalledWith(homeReserveFixture.playerId)
  })
})
