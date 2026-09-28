import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { BenchSkeleton } from '../bench-skeleton/bench-skeleton'
import { PitchSkeleton } from '../pitch-skeleton/pitch-skeleton'
import { liveSkeletonStyles as styles } from './live-skeleton.styles'

const OFFICIALS_ITEMS = [
  { key: 'referee', width: styles.officialsItemWidth.referee, delayMs: 0, isFaint: false },
  { key: 'firstAssistant', width: styles.officialsItemWidth.firstAssistant, delayMs: 80, isFaint: false },
  { key: 'secondAssistant', width: styles.officialsItemWidth.secondAssistant, delayMs: 160, isFaint: false },
  { key: 'fourthOfficial', width: styles.officialsItemWidth.fourthOfficial, delayMs: 240, isFaint: true },
  { key: 'round', width: styles.officialsItemWidth.round, delayMs: 320, isFaint: true },
  { key: 'duration', width: styles.officialsItemWidth.duration, delayMs: 400, isFaint: true },
] as const

const CHIP_DELAYS_MS = [80, 160, 240] as const

export function LiveSkeleton() {
  return (
    <div aria-hidden className={styles.screen}>
      <div className={styles.scoreboard}>
        <Skeleton className={styles.categoryTag} delayMs={140} />
        <div className={styles.scoreGroup}>
          <Skeleton className={styles.teamBlock} />
          <Skeleton className={styles.scoreCenter} delayMs={180} />
          <Skeleton className={styles.teamBlock} delayMs={220} />
        </div>
      </div>
      <div className={styles.officialsStrip}>
        {OFFICIALS_ITEMS.map((item) => (
          <span key={item.key} className={cn(styles.officialsItem, item.width)}>
            <Skeleton className={cn(styles.officialsItemBar, item.isFaint && styles.faintBar)} delayMs={item.delayMs} />
          </span>
        ))}
      </div>
      <div className={styles.eventsStrip}>
        <Skeleton className={styles.eventsLabel} />
        {CHIP_DELAYS_MS.map((delayMs) => (
          <Skeleton key={delayMs} className={styles.eventChip} delayMs={delayMs} />
        ))}
        <Skeleton className={styles.expandButton} delayMs={320} />
      </div>
      <div className={styles.board}>
        <BenchSkeleton delayOffsetMs={0} />
        <PitchSkeleton />
        <BenchSkeleton delayOffsetMs={50} />
      </div>
    </div>
  )
}
