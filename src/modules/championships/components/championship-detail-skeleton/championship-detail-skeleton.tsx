import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { championshipDetailSkeletonStyles as styles } from './championship-detail-skeleton.styles'

const ROW_KEYS = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'] as const
const ROW_DELAY_STEP_MS = 60

export function ChampionshipDetailSkeleton() {
  return (
    <div aria-hidden className={styles.root}>
      <div className={styles.tabs}>
        <Skeleton className={styles.standingsTab} />
        <Skeleton className={styles.statisticsTab} delayMs={80} />
        <Skeleton className={styles.matchesTab} delayMs={160} />
      </div>
      <div className={styles.body}>
        <div className={styles.standingsColumn}>
          <Skeleton className={styles.standingsTitle} />
          <div className={styles.table}>
            <Skeleton className={styles.tableHeader} />
            {ROW_KEYS.map((rowKey, index) => (
              <div key={rowKey} className={styles.row}>
                <Skeleton className={styles.rowPosition} delayMs={index * ROW_DELAY_STEP_MS} />
                <Skeleton className={styles.rowCrest} delayMs={index * ROW_DELAY_STEP_MS} />
                <Skeleton className={styles.rowName} delayMs={index * ROW_DELAY_STEP_MS + 40} />
                <Skeleton className={styles.rowPoints} delayMs={index * ROW_DELAY_STEP_MS + 80} />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.roundColumn}>
          <Skeleton className={styles.roundTitle} />
          <Skeleton className={styles.roundCard} delayMs={100} />
          <Skeleton className={styles.roundCard} delayMs={200} />
          <Skeleton className={styles.roundCard} delayMs={300} />
        </div>
      </div>
    </div>
  )
}
