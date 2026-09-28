import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { LiveMatchProvider } from '../../state/live-context'
import { makeBoardInteractions } from '../bench-column/bench-column.fixtures'
import { liveSnapshotFixture, silenceLiveStream } from '../live-board/live-board.fixtures'
import { BoardArea } from './board-area'

const renderBoard = (isCompact: boolean) =>
  render(
    <LiveMatchProvider snapshot={liveSnapshotFixture}>
      <BoardArea interactions={makeBoardInteractions()} isCompact={isCompact} />
    </LiveMatchProvider>,
  )

describe('BoardArea', () => {
  beforeEach(silenceLiveStream)

  it('places the home bench, the pitch and the away bench side by side', () => {
    const { container } = renderBoard(false)

    const regions = Array.from(container.firstElementChild?.children ?? []).map((region) => region.getAttribute('data-screen-label'))

    expect(regions).toEqual(['Banco', 'Prancheta', 'Banco'])
  })

  it('shows the starters on the pitch and the reserves on each bench', () => {
    renderBoard(false)

    expect(screen.getByRole('button', { name: 'Camisa 9 — Davi Moreira' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Camisa 9 — Otávio Siqueira' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reserva camisa 12 — Caio Brandão' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reserva camisa 12 — Bento Arruda' })).toBeInTheDocument()
  })

  it('shortens the pitch names when the board is compact', () => {
    renderBoard(true)

    expect(screen.getByText('Otávi')).toBeInTheDocument()
  })
})
