import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { recordLiveEvent } from '@/modules/matches/client'
import type { BoardInteractions } from '../../interaction/use-board-interactions'
import { LiveMatchProvider } from '../../state/live-context'
import { useLiveCommands } from '../../state/use-live-commands'
import { strikerMenuFixture } from '../action-menu/action-menu.fixtures'
import { makeBoardInteractions } from '../bench-column/bench-column.fixtures'
import { liveSnapshotFixture, silenceLiveStream } from '../live-board/live-board.fixtures'
import { LiveOverlays } from './live-overlays'
import { benchDragFixture, dotDragFixture, strikerHoverFixture } from './live-overlays.fixtures'

const CardPickerOpener = () => {
  const { openCardPicker } = useLiveCommands()

  return (
    <button type="button" onClick={openCardPicker}>
      Abrir cartões
    </button>
  )
}

const renderOverlays = (interactions: BoardInteractions = makeBoardInteractions()) =>
  render(
    <LiveMatchProvider snapshot={liveSnapshotFixture}>
      <CardPickerOpener />
      <LiveOverlays interactions={interactions} />
    </LiveMatchProvider>,
  )

describe('LiveOverlays', () => {
  beforeEach(() => {
    vi.mocked(recordLiveEvent).mockResolvedValue({ ok: true, data: { id: 'event-1' } })

    return silenceLiveStream()
  })

  it('shows no overlay while nothing is open', () => {
    renderOverlays()

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByText('Caio Brandão')).not.toBeInTheDocument()
  })

  it('opens the action menu for the chosen player', () => {
    renderOverlays(makeBoardInteractions({ menu: strikerMenuFixture }))

    expect(screen.getByRole('menu', { name: 'Ações para camisa 9' })).toBeInTheDocument()
  })

  it('skips the action menu when the player has no match state', () => {
    renderOverlays(makeBoardInteractions({ menu: strikerMenuFixture, playerStates: {} }))

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('closes the action menu through the board interactions', async () => {
    const closeMenu = vi.fn()
    renderOverlays(makeBoardInteractions({ menu: strikerMenuFixture, closeMenu }))

    await userEvent.click(screen.getByRole('menuitem', { name: /^Gol/ }))

    expect(closeMenu).toHaveBeenCalledTimes(1)
  })

  it('shows the player tooltip while hovering a player', () => {
    renderOverlays(makeBoardInteractions({ hover: strikerHoverFixture }))

    expect(screen.getByRole('tooltip')).toHaveTextContent('Davi Moreira')
  })

  it('hides the tooltip while the action menu is open', () => {
    renderOverlays(makeBoardInteractions({ hover: strikerHoverFixture, menu: strikerMenuFixture }))

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('hides the tooltip while a player is dragged', () => {
    renderOverlays(makeBoardInteractions({ hover: strikerHoverFixture, drag: dotDragFixture }))

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('follows the pointer with a ghost while a reserve is dragged from the bench', () => {
    renderOverlays(makeBoardInteractions({ drag: benchDragFixture }))

    expect(screen.getByText('Caio Brandão').parentElement).toHaveClass('border-az')
  })

  it('draws no ghost while a pitch dot is dragged', () => {
    renderOverlays(makeBoardInteractions({ drag: dotDragFixture }))

    expect(screen.queryByText('Davi Moreira')).not.toBeInTheDocument()
  })

  it('records the picked card for the selected player and closes the picker', async () => {
    renderOverlays()

    await userEvent.click(screen.getByRole('button', { name: 'Abrir cartões' }))
    await userEvent.click(screen.getByRole('button', { name: 'Amarelo' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('AMARELO')
  })

  it('closes the card picker without recording when cancelled', async () => {
    renderOverlays()

    await userEvent.click(screen.getByRole('button', { name: 'Abrir cartões' }))
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar (esc)' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
