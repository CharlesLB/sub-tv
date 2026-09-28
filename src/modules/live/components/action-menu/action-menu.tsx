'use client'

import { type KeyboardEvent, useEffect, useRef } from 'react'
import * as R from 'remeda'
import type { MenuState } from '../../interaction/interaction-state'
import { positionLabel } from '../../player-labels/player-labels'
import { CARD_COLOR } from '../../state/live-actions'
import { useLiveState } from '../../state/live-context'
import type { PlayerMatchState } from '../../state/live-state'
import { useLiveCommands } from '../../state/use-live-commands'
import { MENU_MARKER, MenuAction } from '../menu-action/menu-action'
import { actionMenuStyles as styles } from './action-menu.styles'

const MENU_HEIGHT = 232
const MENU_WIDTH = 242
const VIEWPORT_MARGIN = 8
const ESCAPE_KEY = 'Escape'

type ActionMenuProps = { menu: MenuState; matchState: PlayerMatchState; onClose: () => void }

export function ActionMenu({ menu, matchState, onClose }: ActionMenuProps) {
  const { playersById, teams } = useLiveState()
  const commands = useLiveCommands()
  const firstActionRef = useRef<HTMLDivElement | null>(null)
  const player = playersById[menu.playerId]

  useEffect(() => {
    firstActionRef.current?.querySelector('button')?.focus()
  }, [])

  if (!player) return null

  const team = teams[player.side]
  const centerY = menu.anchor.top + (menu.anchor.bottom - menu.anchor.top) / 2
  const top = R.clamp(centerY - MENU_HEIGHT / 2, { min: VIEWPORT_MARGIN, max: Math.max(VIEWPORT_MARGIN, window.innerHeight - MENU_HEIGHT - VIEWPORT_MARGIN) })
  const left = R.clamp(menu.anchor.x, { min: MENU_WIDTH / 2 + VIEWPORT_MARGIN, max: window.innerWidth - MENU_WIDTH / 2 - VIEWPORT_MARGIN })

  const run = (command: () => void) => () => {
    onClose()
    command()
  }

  const closeOnEscape = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === ESCAPE_KEY) onClose()
  }

  const subtitle = [positionLabel(player.position), team.name].filter(Boolean).join(' · ')

  return (
    <>
      <div aria-hidden onClick={onClose} className={styles.scrim} />
      <div role="menu" aria-label={`Ações para camisa ${player.shirtNumber}`} onKeyDown={closeOnEscape} className={styles.menu} style={{ left, top }}>
        <div className={styles.header}>
          <span className={styles.shirtNumber} style={{ color: team.color }}>
            {player.shirtNumber}
          </span>
          <div className={styles.identity}>
            <div className={styles.name}>{player.name}</div>
            <div className={styles.subtitle}>{subtitle}</div>
          </div>
        </div>
        <div ref={firstActionRef} className={styles.actions}>
          <MenuAction
            label="Gol"
            meta={matchState.goals ? `+${matchState.goals}` : ''}
            colorClass={styles.goalMarker}
            marker={MENU_MARKER.ROUND}
            shortcut="G"
            onSelect={run(() => commands.recordGoal(player.playerId))}
          />
          <MenuAction
            label="Assistência"
            meta={matchState.assists ? `+${matchState.assists}` : ''}
            colorClass={styles.assistMarker}
            marker={MENU_MARKER.ROUND}
            shortcut="A"
            onSelect={run(() => commands.recordAssist(player.playerId))}
          />
          <MenuAction
            label="Cartão amarelo"
            meta={matchState.yellowCards ? `+${matchState.yellowCards}` : ''}
            colorClass={styles.yellowCardMarker}
            marker={MENU_MARKER.CARD}
            onSelect={run(() => commands.recordCard(player.playerId, CARD_COLOR.YELLOW))}
          />
          <MenuAction
            label="Cartão vermelho"
            meta={matchState.sentOff ? 'Expulso' : ''}
            colorClass={styles.redCardMarker}
            marker={MENU_MARKER.CARD}
            onSelect={run(() => commands.recordCard(player.playerId, CARD_COLOR.RED))}
          />
        </div>
      </div>
    </>
  )
}
