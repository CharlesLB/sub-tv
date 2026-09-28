import { LIVE_EVENT_TYPE } from '@/modules/matches/client'
import { TIMELINE_MARKER, type TimelineItem } from '../../state/timeline'

export const eventIconStyles = {
  icon: 'flex flex-none',
  kindColor: {
    [LIVE_EVENT_TYPE.GOAL]: '',
    [LIVE_EVENT_TYPE.YELLOW_CARD]: 'text-am',
    [LIVE_EVENT_TYPE.RED_CARD]: 'text-vm',
    [LIVE_EVENT_TYPE.SUBSTITUTION]: 'text-az',
    [TIMELINE_MARKER.HALF_TIME]: 'text-tx4',
    [TIMELINE_MARKER.FULL_TIME]: 'text-tx4',
  } satisfies Record<TimelineItem['kind'], string>,
} as const
