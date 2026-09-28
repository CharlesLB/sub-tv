import { cn } from '@/lib/utils/cn'
import type { TimelineItem } from '../../state/timeline'
import { EventIcon } from '../event-icon/event-icon'
import { eventChipStyles as styles } from './event-chip.styles'

type EventChipProps = { item: TimelineItem; teamColor: string | null; isNewest: boolean }

export function EventChip({ item, teamColor, isNewest }: EventChipProps) {
  return (
    <div className={cn(styles.chip, isNewest && styles.chipNewest)}>
      <EventIcon kind={item.kind} teamColor={teamColor} size={17} />
      <span className={styles.minute}>{item.minuteLabel}</span>
      <span className={styles.text}>{item.text}</span>
    </div>
  )
}
