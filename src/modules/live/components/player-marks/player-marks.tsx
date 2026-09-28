import type { CSSProperties } from 'react'
import { Icon } from '@/components/ui/icon/icon'
import { cn } from '@/lib/utils/cn'
import type { PlayerMatchState } from '../../state/live-state'
import { MARK_CORNER, MARK_TONE, marksOf, type MarkCorner, type MarkTone, type PlayerMark } from './marks-of'

export const MARKS_VARIANT = { PITCH: 'pitch', BENCH: 'bench' } as const

type MarksVariant = (typeof MARKS_VARIANT)[keyof typeof MARKS_VARIANT]

const TONE_CLASS: Record<MarkTone, string> = {
  [MARK_TONE.GOAL]: 'bg-tx text-bg',
  [MARK_TONE.ASSIST]: 'bg-ac text-bg',
  [MARK_TONE.YELLOW]: 'bg-am text-bg',
  [MARK_TONE.RED]: 'bg-vm',
  [MARK_TONE.SECOND_YELLOW]: 'bg-am',
  [MARK_TONE.SUBBED_OUT]: 'bg-vm text-tx',
  [MARK_TONE.SUBBED_IN]: 'bg-ac text-bg',
}

const VARIANT = {
  [MARKS_VARIANT.PITCH]: {
    badge: '40%',
    cardWidth: '32%',
    cardHeight: '42%',
    badgeOffset: 'calc(-22% + 2px)',
    cardOffset: 'calc(-18% + 2px)',
    borderClass: 'border-bg',
    iconClass: 'size-[clamp(6px,1.5cqw,11px)]',
    countClass: 'text-[clamp(6px,1.4cqw,10px)]',
  },
  [MARKS_VARIANT.BENCH]: {
    badge: '13px',
    cardWidth: '10px',
    cardHeight: '13px',
    badgeOffset: '-2px',
    cardOffset: '-1px',
    borderClass: 'border-pan',
    iconClass: 'size-[9px]',
    countClass: 'text-[9px]',
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
    <span
      key={mark.corner}
      title={mark.tip}
      style={markStyle(mark, variant)}
      className={cn(
        'pointer-events-none absolute flex flex-none items-center justify-center overflow-hidden border-[1.5px] p-0',
        mark.isCard ? 'rounded-[2px]' : 'rounded-full',
        sizes.borderClass,
        TONE_CLASS[mark.tone],
      )}
    >
      {mark.tone === MARK_TONE.SECOND_YELLOW ? <span className="absolute inset-0 bg-vm [clip-path:polygon(100%_0,100%_100%,0_100%)]" /> : null}
      {mark.count ? (
        <span className={cn('relative leading-none font-bold', sizes.countClass)}>{mark.count}</span>
      ) : mark.icon ? (
        <Icon name={mark.icon} className={sizes.iconClass} />
      ) : null}
    </span>
  ))
}
