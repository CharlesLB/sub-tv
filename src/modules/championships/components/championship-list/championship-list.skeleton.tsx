import { cn } from '@/lib/utils/cn'
import { skeletonSlots } from '@/lib/utils/skeleton-slots/skeleton-slots'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { CATEGORIES, categoryBorderClass } from '../../categories'
import { ChampionshipCardSkeleton } from '../championship-card/championship-card.skeleton'
import { newChampionshipProviderStyles } from '../new-championship-provider/new-championship-provider.styles'
import { championshipListSkeletonStyles as skeletonStyles } from './championship-list.skeleton.styles'
import { championshipListStyles as styles } from './championship-list.styles'

const CARDS_PER_COLUMN = 2
const COLUMN_DELAY_MS = 100

export function ChampionshipListSkeleton() {
  return (
    <div aria-hidden className={styles.scroller}>
      <div className={newChampionshipProviderStyles.stack}>
        <div className={styles.columns}>
          {CATEGORIES.map((category, columnIndex) => (
            <div key={category} className={styles.column}>
              <div className={cn(styles.columnHeader, categoryBorderClass[category])}>
                <Skeleton className={skeletonStyles.columnTag} delayMs={columnIndex * COLUMN_DELAY_MS} />
                <Skeleton className={cn(styles.columnSummary, skeletonStyles.columnSummary)} delayMs={columnIndex * COLUMN_DELAY_MS} />
              </div>
              {skeletonSlots(CARDS_PER_COLUMN).map(({ slotId, order }) => (
                <ChampionshipCardSkeleton key={slotId} index={columnIndex + order} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
