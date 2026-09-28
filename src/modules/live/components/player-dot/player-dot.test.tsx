import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { directRedMatchStateFixture, onPitchMatchStateFixture } from '../player-marks/player-marks.fixtures'
import { homeTeamFixture } from '../scoreboard-team/scoreboard-team.fixtures'
import { PlayerDot } from './player-dot'
import { homeStrikerFixture } from './player-dot.fixtures'

const DOT_NAME = 'Camisa 9 — Davi Moreira Campos'

const makeHandlers = () => ({ onPointerDown: vi.fn(), onHoverStart: vi.fn(), onHoverEnd: vi.fn(), onKeyboardActivate: vi.fn() })

const baseProps = {
  player: homeStrikerFixture,
  matchState: onPitchMatchStateFixture,
  point: { x: 44, y: 50 },
  teamColor: homeTeamFixture.color,
  isSelected: false,
  isDragged: false,
  isDropTarget: false,
  isCompact: false,
}

describe('PlayerDot', () => {
  it('places the dot at the pitch point and paints it with the team color', () => {
    render(<PlayerDot {...baseProps} {...makeHandlers()} />)

    const dot = screen.getByRole('button', { name: DOT_NAME })
    expect(dot).toHaveTextContent('9')
    expect(dot).toHaveStyle({ background: homeTeamFixture.color })
    expect(dot.parentElement).toHaveStyle({ left: '44%', top: '50%' })
  })

  it('shows the full short name below the dot', () => {
    render(<PlayerDot {...baseProps} {...makeHandlers()} />)

    expect(screen.getByText('Davi Moreira')).toBeInTheDocument()
  })

  it('cuts the short name to five letters on a compact board', () => {
    render(<PlayerDot {...baseProps} isCompact {...makeHandlers()} />)

    expect(screen.getByText('Davi')).toHaveClass('text-[clamp(6px,1.7cqw,10px)]')
  })

  it('marks the selected dot as pressed with the selection ring', () => {
    render(<PlayerDot {...baseProps} isSelected {...makeHandlers()} />)

    const dot = screen.getByRole('button', { name: DOT_NAME })
    expect(dot).toHaveAttribute('aria-pressed', 'true')
    expect(dot).toHaveClass('shadow-[0_0_0_3px_var(--tx)]')
  })

  it('shows the drop ring instead of the selection ring on a drop target', () => {
    render(<PlayerDot {...baseProps} isSelected isDropTarget {...makeHandlers()} />)

    const dot = screen.getByRole('button', { name: DOT_NAME })
    expect(dot).toHaveClass('shadow-[0_0_0_4px_var(--az)]')
    expect(dot).not.toHaveClass('shadow-[0_0_0_3px_var(--tx)]')
    expect(dot.parentElement).toHaveClass('z-[4]')
  })

  it('lifts and grabs the dot while it is dragged', () => {
    render(<PlayerDot {...baseProps} isDragged {...makeHandlers()} />)

    const dot = screen.getByRole('button', { name: DOT_NAME })
    expect(dot).toHaveClass('cursor-grabbing')
    expect(dot.parentElement).toHaveClass('z-[6]')
  })

  it('fades a sent off player with a translucent team color', () => {
    render(<PlayerDot {...baseProps} matchState={directRedMatchStateFixture} {...makeHandlers()} />)

    const dot = screen.getByRole('button', { name: DOT_NAME })
    expect(dot).toHaveClass('opacity-60')
    expect(dot.style.background).toMatch(/^color-mix\(in srgb, .+ 35%, transparent\)$/)
    expect(screen.getByTitle('Cartão vermelho direto')).toBeInTheDocument()
  })

  it('reports pointer down, hover start and hover end with the player id', () => {
    const handlers = makeHandlers()
    render(<PlayerDot {...baseProps} {...handlers} />)
    const dot = screen.getByRole('button', { name: DOT_NAME })

    fireEvent.pointerDown(dot)
    fireEvent.pointerEnter(dot)
    fireEvent.pointerLeave(dot)

    expect(handlers.onPointerDown).toHaveBeenCalledWith(homeStrikerFixture.playerId, expect.anything())
    expect(handlers.onHoverStart).toHaveBeenCalledWith(homeStrikerFixture.playerId, dot)
    expect(handlers.onHoverEnd).toHaveBeenCalledWith(homeStrikerFixture.playerId)
  })

  it('opens the menu only for a keyboard activation', () => {
    const handlers = makeHandlers()
    render(<PlayerDot {...baseProps} {...handlers} />)
    const dot = screen.getByRole('button', { name: DOT_NAME })

    fireEvent.click(dot, { detail: 1 })
    expect(handlers.onKeyboardActivate).not.toHaveBeenCalled()
    fireEvent.click(dot, { detail: 0 })

    expect(handlers.onKeyboardActivate).toHaveBeenCalledWith(homeStrikerFixture.playerId, dot)
  })
})
