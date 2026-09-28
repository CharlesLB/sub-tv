import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { attachAssist, type LiveMatchSnapshot, recordLiveEvent } from '@/modules/matches/client'
import type { MenuState } from '../../interaction/interaction-state'
import { LiveMatchProvider, useLiveState } from '../../state/live-context'
import type { PlayerMatchState } from '../../state/live-state'
import { PLAYER } from '../../state/live-state.fixtures'
import { starterMatchStateFixture } from '../bench-dot/bench-dot.fixtures'
import { liveSnapshotFixture, silenceLiveStream } from '../live-board/live-board.fixtures'
import { ActionMenu } from './action-menu'
import { midfielderMenuFixture, sentOffStrikerFixture, snapshotWithOpenGoalFixture, strikerMenuFixture, strikerWithNumbersFixture } from './action-menu.fixtures'

const LiveProbe = () => {
  const { events, toasts } = useLiveState()

  return (
    <>
      <output aria-label="Lances">{events.length}</output>
      <output aria-label="Aviso">{toasts.at(-1)?.message}</output>
    </>
  )
}

type RenderOptions = { menu?: MenuState; matchState?: PlayerMatchState; snapshot?: LiveMatchSnapshot; onClose?: () => void }

const renderMenu = ({ menu = strikerMenuFixture, matchState = starterMatchStateFixture, snapshot = liveSnapshotFixture, onClose = vi.fn() }: RenderOptions = {}) =>
  render(
    <LiveMatchProvider snapshot={snapshot}>
      <ActionMenu menu={menu} matchState={matchState} onClose={onClose} />
      <LiveProbe />
    </LiveMatchProvider>,
  )

describe('ActionMenu', () => {
  beforeEach(() => {
    vi.mocked(recordLiveEvent).mockResolvedValue({ ok: true, data: { id: 'event-1' } })
    vi.mocked(attachAssist).mockResolvedValue({ ok: true, data: { id: 'event-1' } })

    return silenceLiveStream()
  })

  it('names the menu after the player and shows the position and team', () => {
    renderMenu()

    expect(screen.getByRole('menu', { name: 'Ações para camisa 9' })).toBeInTheDocument()
    expect(screen.getByText('Davi Moreira')).toBeInTheDocument()
    expect(screen.getByText('Atacante · União FC')).toBeInTheDocument()
  })

  it('shows only the team when the player has no position', () => {
    renderMenu({ menu: { ...strikerMenuFixture, playerId: PLAYER.HOME_RESERVE } })

    expect(screen.getByText('União FC')).toBeInTheDocument()
  })

  it('focuses the goal action when it opens', () => {
    renderMenu()

    expect(screen.getByRole('menuitem', { name: /^Gol/ })).toHaveFocus()
  })

  it('centers the menu on the anchor inside the viewport', () => {
    renderMenu()

    expect(screen.getByRole('menu')).toHaveStyle({ left: '300px', top: '104px' })
  })

  it('keeps the menu inside the viewport when the anchor is near the edge', () => {
    renderMenu({ menu: { playerId: strikerMenuFixture.playerId, anchor: { x: 0, top: 0, bottom: 0 } } })

    expect(screen.getByRole('menu')).toHaveStyle({ left: '129px', top: '8px' })
  })

  it('leaves the counters empty for a player with nothing in the match', () => {
    renderMenu()

    expect(screen.getAllByRole('menuitem').map((item) => item.textContent)).toEqual(['Gol', 'Assistência', 'Cartão amarelo', 'Cartão vermelho'])
  })

  it('shows the player goals, assists and yellow cards in this match', () => {
    renderMenu({ matchState: strikerWithNumbersFixture })

    expect(screen.getAllByRole('menuitem').map((item) => item.textContent)).toEqual(['Gol+2', 'Assistência+1', 'Cartão amarelo+1', 'Cartão vermelho'])
  })

  it('flags a sent off player on the red card action', () => {
    renderMenu({ matchState: sentOffStrikerFixture })

    expect(screen.getByRole('menuitem', { name: /^Cartão vermelho/ })).toHaveTextContent('Cartão vermelhoExpulso')
  })

  it('records a goal and closes when the goal action is chosen', async () => {
    const onClose = vi.fn()
    renderMenu({ onClose })

    await userEvent.click(screen.getByRole('menuitem', { name: /^Gol/ }))

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('status', { name: 'Lances' })).toHaveTextContent('1')
    expect(screen.getByRole('status', { name: 'Aviso' })).toHaveTextContent('GOL MARCADO — #9 Davi')
  })

  it('attaches the assist to the open goal when the assist action is chosen', async () => {
    const onClose = vi.fn()
    renderMenu({ menu: midfielderMenuFixture, snapshot: snapshotWithOpenGoalFixture, onClose })

    await userEvent.click(screen.getByRole('menuitem', { name: /^Assistência/ }))

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('status', { name: 'Aviso' })).toHaveTextContent('ASSISTÊNCIA — #10 Heitor')
  })

  it('records a yellow card when the yellow card action is chosen', async () => {
    renderMenu()

    await userEvent.click(screen.getByRole('menuitem', { name: /^Cartão amarelo/ }))

    expect(screen.getByRole('status', { name: 'Aviso' })).toHaveTextContent('AMARELO — #9 Davi')
  })

  it('records a red card when the red card action is chosen', async () => {
    renderMenu()

    await userEvent.click(screen.getByRole('menuitem', { name: /^Cartão vermelho/ }))

    expect(screen.getByRole('status', { name: 'Aviso' })).toHaveTextContent('VERMELHO — #9 Davi')
  })

  it('closes without recording when the backdrop is clicked', async () => {
    const onClose = vi.fn()
    const { container } = renderMenu({ onClose })

    await userEvent.click(container.querySelector('[aria-hidden="true"]') ?? document.body)

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('status', { name: 'Lances' })).toHaveTextContent('0')
  })

  it('renders nothing when the player is unknown', () => {
    renderMenu({ menu: { ...strikerMenuFixture, playerId: 'unknown-player' } })

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})
