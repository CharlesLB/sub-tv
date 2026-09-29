import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SIDE } from '@/modules/matches/client'
import { DRAG_KIND } from '../../interaction/interaction-state'
import type { BoardInteractions } from '../../interaction/use-board-interactions'
import { LiveMatchProvider } from '../../state/live-context'
import { PLAYER } from '../../state/live-state.fixtures'
import { useLiveCommands } from '../../state/use-live-commands'
import { starterMatchStateFixture, subbedOutMatchStateFixture } from '../bench-dot/bench-dot.fixtures'
import { liveSnapshotFixture, silenceLiveStream } from '../live-board/live-board.fixtures'
import { BenchColumn } from './bench-column'
import { makeBoardInteractions } from './bench-column.fixtures'

const HOME_RESERVE_LABEL = 'Reserva camisa 12 — Caio Brandão'

const SubstitutionStarter = () => {
  const { startSubstitution } = useLiveCommands()

  return (
    <button type="button" onClick={startSubstitution}>
      Iniciar substituição
    </button>
  )
}

const renderBench = (side: (typeof SIDE)[keyof typeof SIDE], interactions: BoardInteractions = makeBoardInteractions()) =>
  render(
    <LiveMatchProvider snapshot={liveSnapshotFixture}>
      <SubstitutionStarter />
      <BenchColumn side={side} interactions={interactions} />
    </LiveMatchProvider>,
  )

describe('BenchColumn', () => {
  beforeEach(silenceLiveStream)

  it('lists only the home reserves under the home team header', () => {
    renderBench(SIDE.HOME)

    expect(screen.getByText('Banco')).toBeInTheDocument()
    expect(screen.getByText('União FC · SUB-14')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Reserva/ }).map((button) => button.getAttribute('aria-label'))).toEqual([HOME_RESERVE_LABEL])
  })

  it('places the home bench in the first grid column with the team color on top', () => {
    renderBench(SIDE.HOME)

    const column = screen.getByText('Banco').parentElement?.parentElement

    expect(column).toHaveClass('col-start-1')
    expect(column).toHaveStyle({ borderTopColor: liveSnapshotFixture.teams[SIDE.HOME].color })
  })

  it('lists the away reserves in the third grid column', () => {
    renderBench(SIDE.AWAY)

    expect(screen.getByText('Serra Azul · SUB-14')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reserva camisa 12 — Bento Arruda' })).toBeInTheDocument()
    expect(screen.getByText('Banco').parentElement?.parentElement).toHaveClass('col-start-3')
  })

  it('shows a substituted starter on the bench as unavailable', () => {
    const playerStates = { ...makeBoardInteractions().playerStates, [PLAYER.HOME_MIDFIELDER]: subbedOutMatchStateFixture }
    renderBench(SIDE.HOME, makeBoardInteractions({ playerStates }))

    expect(screen.getByRole('button', { name: 'Reserva camisa 10 — Heitor Lacerda (substituído)' })).toHaveAttribute('aria-disabled', 'true')
  })

  it('skips a reserve whose match state is unknown', () => {
    renderBench(SIDE.HOME, makeBoardInteractions({ playerStates: { [PLAYER.HOME_STRIKER]: starterMatchStateFixture, [PLAYER.HOME_MIDFIELDER]: starterMatchStateFixture } }))

    expect(screen.queryByRole('button', { name: /^Reserva/ })).not.toBeInTheDocument()
  })

  it('fades the reserve that is being dragged from the bench', () => {
    renderBench(SIDE.HOME, makeBoardInteractions({ drag: { kind: DRAG_KIND.BENCH, playerId: PLAYER.HOME_RESERVE, clientX: 0, clientY: 0, targetPlayerId: null } }))

    expect(screen.getByRole('button', { name: HOME_RESERVE_LABEL })).toHaveClass('opacity-50')
  })

  it('does not fade a reserve while a pitch dot is dragged', () => {
    renderBench(SIDE.HOME, makeBoardInteractions({ drag: { kind: DRAG_KIND.DOT, playerId: PLAYER.HOME_RESERVE, point: { x: 10, y: 10 } } }))

    expect(screen.getByRole('button', { name: HOME_RESERVE_LABEL })).not.toHaveClass('opacity-50')
  })

  it('activates the reserve through the board interactions when chosen from the keyboard', () => {
    const activateBenchPlayer = vi.fn()
    renderBench(SIDE.HOME, makeBoardInteractions({ activateBenchPlayer }))

    fireEvent.click(screen.getByRole('button', { name: HOME_RESERVE_LABEL }), { detail: 0 })

    expect(activateBenchPlayer).toHaveBeenCalledWith(PLAYER.HOME_RESERVE)
  })

  it('highlights the reserves of the selected player team while a substitution is pending', async () => {
    renderBench(SIDE.HOME)

    await userEvent.click(screen.getByRole('button', { name: 'Iniciar substituição' }))

    expect(screen.getByText('12').parentElement).toHaveClass('shadow-[0_0_0_2px_var(--az)]')
  })

  it('keeps the other team reserves plain while a substitution is pending', async () => {
    renderBench(SIDE.AWAY)

    await userEvent.click(screen.getByRole('button', { name: 'Iniciar substituição' }))

    expect(screen.getByText('12').parentElement).not.toHaveClass('shadow-[0_0_0_2px_var(--az)]')
  })
})
