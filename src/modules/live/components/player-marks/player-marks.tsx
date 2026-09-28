import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui/icon/icon'
import type { PlayerMatchState } from '../../state/live-state'
import { MARK_CORNER, MARK_TONE, type MarkCorner, marksOf, type PlayerMark } from './marks-of'
import { playerMarksStyles as styles } from './player-marks.styles'

export const MARKS_VARIANT = { PITCH: 'pitch', BENCH: 'bench' } as const

type MarksVariant = (typeof MARKS_VARIANT)[keyof typeof MARKS_VARIANT]

const VARIANT = {
  [MARKS_VARIANT.PITCH]: {
    badge: '40%',
    cardWidth: '32%',
    cardHeight: '42%',
    badgeOffset: 'calc(-22% + 2px)',
    cardOffset: 'calc(-18% + 2px)',
    borderClass: styles.pitchBorder,
    iconClass: styles.pitchIcon,
    countClass: styles.pitchCount,
  },
  [MARKS_VARIANT.BENCH]: {
    badge: '13px',
    cardWidth: '10px',
    cardHeight: '13px',
    badgeOffset: '-2px',
    cardOffset: '-1px',
    borderClass: styles.benchBorder,
    iconClass: styles.benchIcon,
    countClass: styles.benchCount,
  },
} as const

const CORNER_SIDES: Record<MarkCorner, readonly ['top' | 'bottom', 'left' | 'right']> = {
  [MARK_CORNER.TOP_LEFT]: ['top', 'left'],
  [MARK_CORNER.TOP_RIGHT]: ['top', 'right'],
  [MARK_CORNER.BOTTOM_LEFT]: ['bottom', 'left'],
  [MARK_CORNER.BOTTOM_RIGHT]: ['bottom', 'right'],
}

const markStyle = (mark: PlayerMark, variant: MarksVariant): CSSProperties => {
  const sizes = VARIANT[variant]
  const offset = mark.isCard ? sizes.cardOffset : sizes.badgeOffset
  const [vertical, horizontal] = CORNER_SIDES[mark.corner]

  return {
    width: mark.isCard ? sizes.cardWidth : sizes.badge,
    height: mark.isCard ? sizes.cardHeight : sizes.badge,
    [vertical]: offset,
    [horizontal]: offset,
  }
}

type PlayerMarksProps = { state: PlayerMatchState; variant: MarksVariant }

export function PlayerMarks({ state, variant }: PlayerMarksProps) {
  const sizes = VARIANT[variant]

  return marksOf(state).map((mark) => (
    <span key={mark.corner} title={mark.tip} style={markStyle(mark, variant)} className={cn(styles.mark, mark.isCard ? styles.cardMark : styles.badgeMark, sizes.borderClass, styles.tone[mark.tone])}>
      {mark.tone === MARK_TONE.SECOND_YELLOW ? <span className={styles.secondYellowHalf} /> : null}
      {mark.count ? <span className={cn(styles.count, sizes.countClass)}>{mark.count}</span> : mark.icon ? <Icon name={mark.icon} className={sizes.iconClass} /> : null}
    </span>
  ))
}
