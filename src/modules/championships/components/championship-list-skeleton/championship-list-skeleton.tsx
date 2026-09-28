import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { championshipListSkeletonStyles as styles } from './championship-list-skeleton.styles'

const COLUMN_KEYS = ['first', 'second'] as const
const CARD_KEYS = ['first', 'second'] as const
const COLUMN_DELAY_MS = 100
const CARD_DELAY_MS = 400

export function ChampionshipListSkeleton() {
  return (
    <div aria-hidden className={styles.root}>
      <div className={styles.columns}>
        {COLUMN_KEYS.map((columnKey, columnIndex) => (
          <div key={columnKey} className={styles.column}>
            <div className={styles.columnHeader}>
              <Skeleton className={styles.columnTag} delayMs={columnIndex * COLUMN_DELAY_MS} />
              <Skeleton className={styles.columnSummary} delayMs={columnIndex * COLUMN_DELAY_MS + 100} />
            </div>
            {CARD_KEYS.map((cardKey, cardIndex) => {
              const baseDelay = columnIndex * COLUMN_DELAY_MS + cardIndex * CARD_DELAY_MS

              return (
                <div key={cardKey} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitleBlock}>
                      <Skeleton className={styles.cardName} delayMs={baseDelay + 50} />
                      <Skeleton className={styles.cardStatus} delayMs={baseDelay + 100} />
                    </div>
                    <Skeleton className={styles.cardTag} delayMs={baseDelay + 150} />
                  </div>
                  <div className={styles.podium}>
                    <Skeleton className={styles.podiumLine} delayMs={baseDelay + 200} />
                    <Skeleton className={styles.podiumLine} delayMs={baseDelay + 250} />
                    <Skeleton className={styles.podiumLine} delayMs={baseDelay + 300} />
                  </div>
                  <Skeleton className={styles.matchStatus} delayMs={baseDelay + 350} />
                  <Skeleton className={styles.openButton} delayMs={baseDelay + 400} />
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
