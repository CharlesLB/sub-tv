import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { teamListSkeletonStyles as styles } from './team-list-skeleton.styles'

const ROWS = [
  { key: 'first', nameWidth: '82%', isActive: true, isFaded: false },
  { key: 'second', nameWidth: '70%', isActive: false, isFaded: false },
  { key: 'third', nameWidth: '88%', isActive: false, isFaded: false },
  { key: 'fourth', nameWidth: '64%', isActive: false, isFaded: true },
] as const

const ROW_DELAY_MS = 100

export function TeamListSkeleton() {
  return (
    <div aria-hidden className={styles.list}>
      <div className={styles.filterLabelRow}>
        <Skeleton className={styles.filterLabel} />
      </div>
      <div className={styles.filters}>
        <Skeleton className={styles.activeFilter} />
        <Skeleton className={styles.filter} delayMs={100} />
        <Skeleton className={styles.filter} delayMs={200} />
      </div>
      <div className={styles.teamsLabelRow}>
        <Skeleton className={styles.teamsLabel} delayMs={100} />
      </div>
      {ROWS.map((row, index) => {
        const delay = index * ROW_DELAY_MS
        const fillClass = row.isFaded ? styles.fillFaded : styles.fillFilled

        return (
          <div key={row.key} className={cn(styles.row, row.isActive ? styles.rowActive : styles.rowIdle)}>
            <Skeleton className={cn(styles.crest, fillClass)} delayMs={delay} />
            <span className={styles.details}>
              <Skeleton className={cn(styles.name, fillClass)} delayMs={delay + 50} style={{ width: row.nameWidth }} />
              <Skeleton className={cn(styles.category, fillClass)} delayMs={delay + 100} />
            </span>
          </div>
        )
      })}
    </div>
  )
}
