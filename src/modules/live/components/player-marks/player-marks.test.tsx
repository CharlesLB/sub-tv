import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MARKS_VARIANT, PlayerMarks } from './player-marks'
import {
  busyMatchStateFixture,
  directRedMatchStateFixture,
  onPitchMatchStateFixture,
  secondYellowMatchStateFixture,
  singleActionsMatchStateFixture,
  subbedOutMatchStateFixture,
} from './player-marks.fixtures'

describe('PlayerMarks', () => {
  it('renders nothing for a player without events in the match', () => {
    const { container } = render(<PlayerMarks state={onPitchMatchStateFixture} variant={MARKS_VARIANT.PITCH} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('marks goals, assists, a yellow card and the entrance in their corners', () => {
    render(<PlayerMarks state={busyMatchStateFixture} variant={MARKS_VARIANT.PITCH} />)

    expect(screen.getByTitle('2 gols')).toHaveTextContent('2')
    expect(screen.getByTitle('1 assistência')).toBeInTheDocument()
    expect(screen.getByTitle('Cartão amarelo')).toHaveClass('bg-am', 'rounded-[2px]')
    expect(screen.getByTitle('Entrou em campo')).toHaveClass('bg-ac', 'rounded-full')
  })

  it('shows an icon instead of a count for a single goal and assist', () => {
    render(<PlayerMarks state={singleActionsMatchStateFixture} variant={MARKS_VARIANT.PITCH} />)

    expect(screen.getByTitle('1 gol').textContent).toBe('')
    expect(screen.getByTitle('1 gol').querySelector('svg')).toBeInTheDocument()
    expect(screen.getByTitle('1 assistência').querySelector('svg')).toBeInTheDocument()
  })

  it('marks a direct red card', () => {
    render(<PlayerMarks state={directRedMatchStateFixture} variant={MARKS_VARIANT.PITCH} />)

    expect(screen.getByTitle('Cartão vermelho direto')).toHaveClass('bg-vm')
  })

  it('splits the card mark in yellow and red for a second yellow', () => {
    render(<PlayerMarks state={secondYellowMatchStateFixture} variant={MARKS_VARIANT.PITCH} />)

    const mark = screen.getByTitle('Expulso por 2º amarelo')
    expect(mark).toHaveClass('bg-am')
    expect(mark.firstElementChild).toHaveClass('bg-vm')
  })

  it('marks a substituted player', () => {
    render(<PlayerMarks state={subbedOutMatchStateFixture} variant={MARKS_VARIANT.PITCH} />)

    expect(screen.getByTitle('Substituído')).toHaveClass('bg-vm')
  })

  it('sizes the marks in pixels on the bench', () => {
    render(<PlayerMarks state={busyMatchStateFixture} variant={MARKS_VARIANT.BENCH} />)

    expect(screen.getByTitle('2 gols')).toHaveStyle({ width: '13px', height: '13px', top: '-2px', right: '-2px' })
    expect(screen.getByTitle('Cartão amarelo')).toHaveStyle({ width: '10px', height: '13px', bottom: '-1px', right: '-1px' })
  })

  it('sizes the marks relative to the dot on the pitch', () => {
    render(<PlayerMarks state={busyMatchStateFixture} variant={MARKS_VARIANT.PITCH} />)

    expect(screen.getByTitle('2 gols')).toHaveStyle({ width: '40%', height: '40%' })
    expect(screen.getByTitle('2 gols')).toHaveClass('border-bg')
  })
})
