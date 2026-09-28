import { fireEvent, render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { PitchDot } from './pitch-dot'
import { pitchDotStyles } from './pitch-dot.styles'

const DESCRIPTION = 'Camisa 10 — Matheus Rocha, Estrela do Vale'
const DOT_NAME = `${DESCRIPTION}. Enter manda ao banco`

const propsOf = (overrides: Partial<ComponentProps<typeof PitchDot>> = {}): ComponentProps<typeof PitchDot> => ({
  shirtNumber: 10,
  label: 'Teteu',
  description: DESCRIPTION,
  color: '#1f4fa3',
  point: { x: 32, y: 40 },
  isDragging: false,
  isSwapTarget: false,
  onPointerDown: vi.fn(),
  onKeyboardBench: vi.fn(),
  ...overrides,
})

describe('PitchDot', () => {
  it('shows the shirt number, the label and a hint about dragging in the title', () => {
    render(<PitchDot {...propsOf()} />)

    const dot = screen.getByRole('button', { name: DOT_NAME })

    expect(dot).toHaveTextContent('10')
    expect(dot).toHaveAttribute('title', `${DESCRIPTION} — arraste para reposicionar, clique para mandar ao banco`)
    expect(screen.getByText('Teteu')).toBeInTheDocument()
  })

  it('places the dot at the pitch point in percent', () => {
    render(<PitchDot {...propsOf()} />)

    expect(screen.getByRole('button', { name: DOT_NAME }).parentElement).toHaveStyle({ left: '32%', top: '40%' })
  })

  it.each(['Enter', ' ', 'Delete', 'Backspace'])('sends the player to the bench when %j is pressed', (key) => {
    const onKeyboardBench = vi.fn()
    render(<PitchDot {...propsOf({ onKeyboardBench })} />)

    fireEvent.keyDown(screen.getByRole('button', { name: DOT_NAME }), { key })

    expect(onKeyboardBench).toHaveBeenCalledOnce()
  })

  it('ignores other keys', () => {
    const onKeyboardBench = vi.fn()
    render(<PitchDot {...propsOf({ onKeyboardBench })} />)

    fireEvent.keyDown(screen.getByRole('button', { name: DOT_NAME }), { key: 'a' })

    expect(onKeyboardBench).not.toHaveBeenCalled()
  })

  it('reports the pointer down that starts a drag', () => {
    const onPointerDown = vi.fn()
    render(<PitchDot {...propsOf({ onPointerDown })} />)

    fireEvent.pointerDown(screen.getByRole('button', { name: DOT_NAME }))

    expect(onPointerDown).toHaveBeenCalledOnce()
  })

  it('uses the dragging look while dragged and the highlight while a swap target', () => {
    const { rerender } = render(<PitchDot {...propsOf({ isDragging: true })} />)

    expect(screen.getByRole('button', { name: DOT_NAME })).toHaveClass(pitchDotStyles.dotDragging)

    rerender(<PitchDot {...propsOf({ isSwapTarget: true })} />)

    expect(screen.getByRole('button', { name: DOT_NAME })).toHaveClass(pitchDotStyles.dotSwapTarget)
    expect(screen.getByRole('button', { name: DOT_NAME }).parentElement).toHaveClass(pitchDotStyles.anchorSwapTarget)
  })
})
