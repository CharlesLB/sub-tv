import { Icon } from '@/components/ui/icon/icon'
import type { IconName } from '@/components/ui/icon/icon-paths'
import { cn } from '@/lib/utils/cn'
import { LIVE_EVENT_TYPE } from '@/modules/matches/client'
import { TIMELINE_MARKER, type TimelineItem } from '../../state/timeline'

type EventKind = TimelineItem['kind']

const EVENT_ICON: Record<EventKind, IconName> = {
  [LIVE_EVENT_TYPE.GOAL]: 'sportsSoccer',
  [LIVE_EVENT_TYPE.YELLOW_CARD]: 'rectangle',
  [LIVE_EVENT_TYPE.RED_CARD]: 'rectangle',
  [LIVE_EVENT_TYPE.SUBSTITUTION]: 'swapHoriz',
  [TIMELINE_MARKER.HALF_TIME]: 'timer',
  [TIMELINE_MARKER.FULL_TIME]: 'flag',
}

const EVENT_COLOR_CLASS: Record<EventKind, string> = {
  [LIVE_EVENT_TYPE.GOAL]: '',
  [LIVE_EVENT_TYPE.YELLOW_CARD]: 'text-am',
  [LIVE_EVENT_TYPE.RED_CARD]: 'text-vm',
  [LIVE_EVENT_TYPE.SUBSTITUTION]: 'text-az',
  [TIMELINE_MARKER.HALF_TIME]: 'text-tx4',
  [TIMELINE_MARKER.FULL_TIME]: 'text-tx4',
}

type EventIconProps = { kind: EventKind; teamColor: string | null; size: number }

export function EventIcon({ kind, teamColor, size }: EventIconProps) {
  const isGoal = kind === LIVE_EVENT_TYPE.GOAL

  return (
    <span className={cn('flex flex-none', EVENT_COLOR_CLASS[kind])} style={isGoal && teamColor ? { color: teamColor } : undefined}>
      <Icon name={EVENT_ICON[kind]} size={size} />
    </span>
  )
}
