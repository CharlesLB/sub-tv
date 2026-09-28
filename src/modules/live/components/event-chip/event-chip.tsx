import { cn } from '@/lib/utils/cn'
import type { TimelineItem } from '../../state/timeline'
import { EventIcon } from '../event-icon/event-icon'

type EventChipProps = { item: TimelineItem; teamColor: string | null; isNewest: boolean }

export function EventChip({ item, teamColor, isNewest }: EventChipProps) {
  return (
    <div className={cn('flex flex-none items-center gap-2 rounded-card border border-bd bg-pan px-[14px] py-2', isNewest && 'animate-event-in')}>
      <EventIcon kind={item.kind} teamColor={teamColor} size={17} />
      <span className="text-[12.8px] text-tx2 nums">{item.minuteLabel}</span>
      <span className="text-[11.7px] font-semibold tracking-[-.01em] whitespace-nowrap text-tx">{item.text}</span>
    </div>
  )
}
