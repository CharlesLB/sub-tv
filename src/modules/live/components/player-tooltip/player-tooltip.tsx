'use client'

import * as R from 'remeda'
import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui/icon/icon'
import { categoryLabel } from '@/modules/championships/client'
import type { HoverState } from '../../interaction/interaction-state'
import { footLabel, positionLabel } from '../../lib/player-labels/player-labels'
import { useLiveState } from '../../state/live-context'
import type { PlayerMatchState } from '../../state/live-state'
import { seasonNumbersWithMatch } from '../../state/selectors'
import { TooltipStat } from '../tooltip-stat/tooltip-stat'
import { matchHighlightsOf } from './match-highlights'
import { playerTooltipStyles as styles } from './player-tooltip.styles'

const HORIZONTAL_MARGIN = 170
const ANCHOR_GAP = 12
const MINIMUM_SPACE_ABOVE = 260

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
    <div role="tooltip" className={cn(styles.tooltip, !showBelow && styles.tooltipAbove)} style={{ left, top }}>
      <div className={styles.header}>
        <span className={styles.shirtNumber} style={{ color: team.color }}>
          {player.shirtNumber}
        </span>
        <span className={styles.name}>{player.name}</span>
      </div>
      <div className={styles.subtitle}>{subtitle}</div>
      <div className={styles.stats}>
        <TooltipStat label="Gols" value={numbers.goals} highlightClass={styles.goalsHighlight} />
        <TooltipStat label="Assist." value={numbers.assists} highlightClass={null} />
        <TooltipStat label="Amarelos" value={numbers.yellowCards} highlightClass={styles.yellowCardsHighlight} />
        <TooltipStat label="Jogos" value={numbers.games} highlightClass={null} />
      </div>
      {highlights.length > 0 ? (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Nesta partida</div>
          <div className={styles.highlights}>
            {highlights.map((highlight) => (
              <div key={highlight.text} className={styles.highlight}>
                <span className={cn(styles.highlightMarker, highlight.isCard ? styles.cardMarker : styles.roundMarker, styles.highlightTone[highlight.tone])} />
                <span className={styles.highlightText}>{highlight.text}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {player.curiosities.length > 0 ? (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Curiosidades</div>
          {player.curiosities.map((curiosity) => (
            <div key={curiosity} className={styles.curiosity}>
              <Icon name="star" size={13} className={styles.curiosityIcon} />
              <div className={styles.curiosityText}>{curiosity}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
