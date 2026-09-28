'use client'

import { DRAG_KIND } from '../../interaction/interaction-state'
import type { BoardInteractions } from '../../interaction/use-board-interactions'
import { useLiveState } from '../../state/live-context'
import { useLiveCommands } from '../../state/use-live-commands'
import { ActionMenu } from '../action-menu/action-menu'
import { CardPicker } from '../card-picker/card-picker'
import { DragGhost } from '../drag-ghost/drag-ghost'
import { PlayerTooltip } from '../player-tooltip/player-tooltip'
import { ToastStack } from '../toast-stack/toast-stack'

type LiveOverlaysProps = { interactions: BoardInteractions }

export function LiveOverlays({ interactions }: LiveOverlaysProps) {
  const { cardPickerOpen, selectedPlayerId, playersById, teams } = useLiveState()
  const commands = useLiveCommands()
  const { menu, hover, drag, playerStates, closeMenu } = interactions
  const menuState = menu ? playerStates[menu.playerId] : undefined
  const hoverState = hover && !drag && !menu ? playerStates[hover.playerId] : undefined
  const ghostPlayer = drag?.kind === DRAG_KIND.BENCH ? playersById[drag.playerId] : undefined

  return (
    <>
      {menu && menuState ? <ActionMenu menu={menu} matchState={menuState} onClose={closeMenu} /> : null}
      {hover && hoverState ? <PlayerTooltip hover={hover} matchState={hoverState} /> : null}
      {drag?.kind === DRAG_KIND.BENCH && ghostPlayer ? (
        <DragGhost player={ghostPlayer} teamColor={teams[ghostPlayer.side].color} clientX={drag.clientX} clientY={drag.clientY} hasTarget={drag.targetPlayerId !== null} />
      ) : null}
      {cardPickerOpen && selectedPlayerId ? <CardPicker onPick={(color) => commands.recordCard(selectedPlayerId, color)} onCancel={commands.closeOverlays} /> : null}
      <ToastStack />
    </>
  )
}
