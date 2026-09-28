import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui/icon/icon'
import type { IconName } from '@/components/ui/icon/icon-paths'
import { LIVE_EVENT_TYPE } from '@/modules/matches/client'
import { TIMELINE_MARKER, type TimelineItem } from '../../state/timeline'
import { eventIconStyles as styles } from './event-icon.styles'

type EventKind = TimelineItem['kind']

const EVENT_ICON: Record<EventKind, IconName> = {
  [LIVE_EVENT_TYPE.GOAL]: 'sportsSoccer',
  [LIVE_EVENT_TYPE.YELLOW_CARD]: 'rectangle',
  [LIVE_EVENT_TYPE.RED_CARD]: 'rectangle',
  [LIVE_EVENT_TYPE.SUBSTITUTION]: 'swapHoriz',
  [TIMELINE_MARKER.HALF_TIME]: 'timer',
  [TIMELINE_MARKER.FULL_TIME]: 'flag',
}

type EventIconProps = { kind: EventKind; teamColor: string | null; size: number }

export function EventIcon({ kind, teamColor, size }: EventIconProps) {
  const isGoal = kind === LIVE_EVENT_TYPE.GOAL

  return (
    <span className={cn(styles.icon, styles.kindColor[kind])} style={isGoal && teamColor ? { color: teamColor } : undefined}>
      <Icon name={EVENT_ICON[kind]} size={size} />
    </span>
  )
}
