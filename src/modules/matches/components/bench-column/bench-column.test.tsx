import { fireEvent, render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { awayTeamFixture, homeTeamFixture } from '../lineup-card/lineup-card.fixtures'
import { BenchColumn } from './bench-column'
import { benchColumnStyles } from './bench-column.styles'

const homeReserves = homeTeamFixture.players.slice(11)
const RESERVE_NAME = 'Reserva camisa 12, Otávio Siqueira'

const propsOf = (overrides: Partial<ComponentProps<typeof BenchColumn>> = {}): ComponentProps<typeof BenchColumn> => ({
  team: homeTeamFixture,
  categoryLabel: 'SUB-14',
  starterCount: 11,
  reserves: homeReserves,
  draggingPlayerId: null,
  placement: 'left',
  onPointerDown: vi.fn(),
  onKeyboardAdd: vi.fn(),
  ...overrides,
})

describe('BenchColumn', () => {
  it('shows the team bench header and one button per reserve with its short name', () => {
    render(<BenchColumn {...propsOf()} />)

    expect(screen.getByLabelText('Banco Estrela do Vale')).toBeInTheDocument()
    expect(screen.getByText('Estrela do Vale · SUB-14')).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(3)
    expect(screen.getByRole('button', { name: 'Reserva camisa 14, Rafael Campos' })).toHaveTextContent('14Rafa')
  })

  it('tells the lineup is full and suggests swapping when eleven players are on the pitch', () => {
    render(<BenchColumn {...propsOf()} />)

    expect(screen.getByText('11/11 em campo')).toHaveClass(benchColumnStyles.starterCountFull)
    expect(screen.getByRole('button', { name: RESERVE_NAME })).toHaveAttribute('title', 'Arraste até um titular no campo para trocar — Otávio Siqueira')
  })

  it('suggests clicking or dragging while the lineup is incomplete', () => {
    render(<BenchColumn {...propsOf({ team: awayTeamFixture, starterCount: 9, reserves: awayTeamFixture.players.slice(9), placement: 'right' })} />)

    expect(screen.getByText('9/11 em campo')).toHaveClass(benchColumnStyles.starterCountIncomplete)
    expect(screen.getByRole('button', { name: 'Reserva camisa 13, Isaque Farias' })).toHaveAttribute('title', 'Isaque Farias — clique para escalar ou arraste até o campo')
  })

  it('dims the reserve being dragged', () => {
    render(<BenchColumn {...propsOf({ draggingPlayerId: 'estrela-12' })} />)

    expect(screen.getByRole('button', { name: RESERVE_NAME })).toHaveClass(benchColumnStyles.reserveDragging)
    expect(screen.getByRole('button', { name: 'Reserva camisa 13, Pedro Henrique Alves' })).not.toHaveClass(benchColumnStyles.reserveDragging)
  })

  it.each(['Enter', ' '])('adds the reserve from the keyboard when %j is pressed', (key) => {
    const onKeyboardAdd = vi.fn()
    render(<BenchColumn {...propsOf({ onKeyboardAdd })} />)

    fireEvent.keyDown(screen.getByRole('button', { name: RESERVE_NAME }), { key })

    expect(onKeyboardAdd).toHaveBeenCalledWith(homeReserves[0])
  })

  it('ignores other keys', () => {
    const onKeyboardAdd = vi.fn()
    render(<BenchColumn {...propsOf({ onKeyboardAdd })} />)

    fireEvent.keyDown(screen.getByRole('button', { name: RESERVE_NAME }), { key: 'Tab' })

    expect(onKeyboardAdd).not.toHaveBeenCalled()
  })

  it('reports the pointer down with the reserve', () => {
    const onPointerDown = vi.fn()
    render(<BenchColumn {...propsOf({ onPointerDown })} />)

    fireEvent.pointerDown(screen.getByRole('button', { name: RESERVE_NAME }))

    expect(onPointerDown).toHaveBeenCalledWith(homeReserves[0], expect.anything())
  })
})
