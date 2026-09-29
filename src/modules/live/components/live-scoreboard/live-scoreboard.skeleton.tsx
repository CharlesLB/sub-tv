import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { liveScoreboardSkeletonStyles as styles } from './live-scoreboard.skeleton.styles'
import { liveScoreboardStyles } from './live-scoreboard.styles'

export function LiveScoreboardSkeleton() {
  return (
    <div aria-hidden className={liveScoreboardStyles.bar}>
      <Skeleton className={styles.categoryTag} />
      <div className={liveScoreboardStyles.scoreGroup}>
        <Skeleton className={styles.team} delayMs={60} />
        <div className={liveScoreboardStyles.scorePanel}>
          <Skeleton className={styles.score} delayMs={120} />
          <Skeleton className={styles.chrono} delayMs={180} />
          <Skeleton className={styles.score} delayMs={240} />
        </div>
        <Skeleton className={styles.team} delayMs={300} />
      </div>
      <Skeleton className={styles.connection} delayMs={360} />
    </div>
  )
}
