'use client'

import { useEffect, useRef } from 'react'
import * as R from 'remeda'
import { CARD_COLOR } from '../../state/live-actions'
import { useLiveState } from '../../state/live-context'
import type { PlayerMatchState } from '../../state/live-state'
import { useLiveCommands } from '../../state/use-live-commands'
import type { MenuState } from '../../interaction/interaction-state'
import { MENU_MARKER, MenuAction } from '../menu-action/menu-action'
import { positionLabel } from '../../player-labels/player-labels'

const MENU_HEIGHT = 232
const MENU_WIDTH = 242
const VIEWPORT_MARGIN = 8

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
  const subtitle = [positionLabel(player.position), team.name].filter(Boolean).join(' · ')

  return (
    <>
      <div aria-hidden onClick={onClose} className="fixed inset-0 z-[75] bg-scrim-leve" />
      <div
        role="menu"
        aria-label={`Ações para camisa ${player.shirtNumber}`}
        className="fixed z-[78] flex max-h-[calc(100vh-16px)] w-[242px] -translate-x-1/2 animate-fade-in flex-col gap-[3px] overflow-y-auto border border-bd2 bg-pan2 px-[10px] py-3 [clip-path:polygon(0_0,calc(100%_-_12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%_-_12px))]"
        style={{ left, top }}
      >
        <div className="flex items-center gap-[10px] border-b border-bd px-1 pb-[9px]">
          <span className="text-[23.4px] leading-[.9] font-bold nums" style={{ color: team.color }}>
            {player.shirtNumber}
          </span>
          <div className="min-w-0">
            <div className="truncate text-[13.5px] font-bold tracking-[-.01em] whitespace-nowrap text-tx">{player.name}</div>
            <div className="truncate text-[8.6px] font-semibold tracking-[-.01em] whitespace-nowrap text-tx4">{subtitle}</div>
          </div>
        </div>
        <div ref={firstActionRef} className="flex flex-col gap-[3px]">
          <MenuAction label="Gol" meta={matchState.goals ? `+${matchState.goals}` : ''} colorClass="bg-ac" marker={MENU_MARKER.ROUND} shortcut="G" onSelect={run(() => commands.recordGoal(player.playerId))} />
          <MenuAction
            label="Assistência"
            meta={matchState.assists ? `+${matchState.assists}` : ''}
            colorClass="bg-az"
            marker={MENU_MARKER.ROUND}
            shortcut="A"
            onSelect={run(() => commands.recordAssist(player.playerId))}
          />
          <MenuAction
            label="Cartão amarelo"
            meta={matchState.yellowCards ? `+${matchState.yellowCards}` : ''}
            colorClass="bg-am"
            marker={MENU_MARKER.CARD}
            shortcut="C"
            onSelect={run(() => commands.recordCard(player.playerId, CARD_COLOR.YELLOW))}
          />
          <MenuAction
            label="Cartão vermelho"
            meta={matchState.sentOff ? 'Expulso' : ''}
            colorClass="bg-vm"
            marker={MENU_MARKER.CARD}
            shortcut="C"
            onSelect={run(() => commands.recordCard(player.playerId, CARD_COLOR.RED))}
          />
        </div>
      </div>
    </>
  )
}
