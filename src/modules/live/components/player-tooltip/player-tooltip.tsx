'use client'

import * as R from 'remeda'
import { Icon } from '@/components/ui/icon/icon'
import { cn } from '@/lib/utils/cn'
import { categoryLabel } from '@/modules/championships/client'
import type { HoverState } from '../../interaction/interaction-state'
import { footLabel, positionLabel } from '../../player-labels/player-labels'
import { useLiveState } from '../../state/live-context'
import type { PlayerMatchState } from '../../state/live-state'
import { seasonNumbersWithMatch } from '../../state/selectors'
import { TooltipStat } from '../tooltip-stat/tooltip-stat'
import { HIGHLIGHT_TONE, matchHighlightsOf, type HighlightTone } from './match-highlights'

const HORIZONTAL_MARGIN = 170
const ANCHOR_GAP = 12
const MINIMUM_SPACE_ABOVE = 260

const HIGHLIGHT_CLASS: Record<HighlightTone, string> = {
  [HIGHLIGHT_TONE.GOAL]: 'bg-tx',
  [HIGHLIGHT_TONE.ASSIST]: 'bg-ac',
  [HIGHLIGHT_TONE.YELLOW]: 'bg-am',
  [HIGHLIGHT_TONE.RED]: 'bg-vm',
  [HIGHLIGHT_TONE.IN]: 'bg-ac',
  [HIGHLIGHT_TONE.OUT]: 'bg-vm',
}

const SECTION_TITLE = 'text-[8.6px] font-semibold tracking-[-.01em] text-tx4'

type PlayerTooltipProps = { hover: HoverState; matchState: PlayerMatchState }

export function PlayerTooltip({ hover, matchState }: PlayerTooltipProps) {
  const { playersById, teams, category, events } = useLiveState()
  const player = playersById[hover.playerId]
  if (!player) return null

  const team = teams[player.side]
  const numbers = seasonNumbersWithMatch(player, events)
  const highlights = matchHighlightsOf(matchState)
  const status = matchState.subbedOut ? 'Substituído' : matchState.onPitch ? null : 'Reserva'
  const subtitle = [positionLabel(player.position), footLabel(player.preferredFoot), `${team.name} ${categoryLabel[category]}`, player.nickname ? `"${player.nickname}"` : null, status]
    .filter(Boolean)
    .join(' · ')
  const showBelow = hover.anchor.top < MINIMUM_SPACE_ABOVE
  const left = R.clamp(hover.anchor.x, { min: HORIZONTAL_MARGIN, max: window.innerWidth - HORIZONTAL_MARGIN })
  const top = showBelow ? hover.anchor.bottom + ANCHOR_GAP : hover.anchor.top - ANCHOR_GAP

  return (
    <div
      role="tooltip"
      className={cn(
        'chamfer-small pointer-events-none fixed z-[80] flex w-max max-w-[320px] -translate-x-1/2 animate-fade-in flex-col gap-[6px] border border-bd2 bg-pan2 px-[15px] py-3',
        !showBelow && '-translate-y-full',
      )}
      style={{ left, top }}
    >
      <div className="flex items-center gap-[11px]">
        <span className="text-[27px] leading-[.9] font-bold nums" style={{ color: team.color }}>
          {player.shirtNumber}
        </span>
        <span className="text-[15.3px] leading-[1.05] font-bold tracking-[-.01em] text-tx">{player.name}</span>
      </div>
      <div className="text-[9.5px] font-semibold tracking-[-.01em] text-pretty text-tx2">{subtitle}</div>
      <div className="flex items-center gap-[15px] border-t border-bd pt-[9px]">
        <TooltipStat label="Gols" value={numbers.goals} highlightClass="text-ac" />
        <TooltipStat label="Assist." value={numbers.assists} highlightClass={null} />
        <TooltipStat label="Amarelos" value={numbers.yellowCards} highlightClass="text-am" />
        <TooltipStat label="Jogos" value={numbers.games} highlightClass={null} />
      </div>
      {highlights.length > 0 ? (
        <div className="flex flex-col gap-[5px] border-t border-bd pt-[9px]">
          <div className={SECTION_TITLE}>Nesta partida</div>
          <div className="flex flex-wrap gap-x-[14px] gap-y-1">
            {highlights.map((highlight) => (
              <div key={highlight.text} className="flex items-center gap-[7px]">
                <span className={cn('size-[9px] flex-none', highlight.isCard ? 'rounded-[2px]' : 'rounded-full', HIGHLIGHT_CLASS[highlight.tone])} />
                <span className="text-[10.3px] font-bold tracking-[-.01em] whitespace-nowrap text-tx">{highlight.text}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {player.curiosities.length > 0 ? (
        <div className="flex flex-col gap-[5px] border-t border-bd pt-[9px]">
          <div className={SECTION_TITLE}>Curiosidades</div>
          {player.curiosities.map((curiosity) => (
            <div key={curiosity} className="flex items-start gap-2">
              <Icon name="star" size={13} className="mt-[2px] text-ac" />
              <div className="text-[12.5px] leading-[1.4] text-pretty text-tx">{curiosity}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
