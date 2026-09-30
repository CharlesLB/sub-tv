import { cn } from '@/lib/utils/cn'
import { skeletonSlots } from '@/lib/utils/skeleton-slots/skeleton-slots'
import { crestStyles } from '@/components/ui/crest/crest.styles'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { FORM_LENGTH } from '../../lib/form-result/form-result'
import { formSquaresStyles } from '../form-squares/form-squares.styles'
import { standingsRowStyles as rowStyles } from '../standings-row/standings-row.styles'
import { STANDINGS_HEADERS } from './standings-table'
import { standingsTableSkeletonStyles as skeletonStyles } from './standings-table.skeleton.styles'
import { standingsTableStyles as styles } from './standings-table.styles'

const ROW_COUNT = 10
const ROW_DELAY_STEP_MS = 60
const WIDE_ONLY_NUMBER_CELLS = 3
const CREST_SIZE = { width: 18, height: 22 } as const

export function StandingsTableSkeleton() {
  return (
    <div aria-hidden className={styles.table}>
      <div className={styles.groupName}>
        <Skeleton className={skeletonStyles.groupName} />
      </div>
      <div className={cn(styles.grid, styles.headerRow)}>
        {STANDINGS_HEADERS.map((header) => (
          <span key={header.label} className={cn(styles.headerCell, header.className)}>
            {header.label}
          </span>
        ))}
      </div>
      {skeletonSlots(ROW_COUNT).map(({ slotId, order }) => {
        const delayMs = order * ROW_DELAY_STEP_MS

        return (
          <div key={slotId} className={cn(rowStyles.grid, rowStyles.summary)}>
            <Skeleton className={cn(rowStyles.position, skeletonStyles.position)} delayMs={delayMs} />
            <span className={rowStyles.club}>
              <span className={rowStyles.chevron} />
              <Skeleton className={crestStyles.hexagon} style={CREST_SIZE} delayMs={delayMs} />
              <Skeleton className={cn(rowStyles.clubName, skeletonStyles.clubName)} delayMs={delayMs} />
            </span>
            <Skeleton className={cn(rowStyles.points, skeletonStyles.centeredNumber)} delayMs={delayMs} />
            <Skeleton className={cn(rowStyles.numberCell, skeletonStyles.centeredNumber)} delayMs={delayMs} />
            {skeletonSlots(WIDE_ONLY_NUMBER_CELLS).map((cell) => (
              <Skeleton key={cell.slotId} className={cn(rowStyles.numberCell, rowStyles.wideOnly, skeletonStyles.centeredNumber)} delayMs={delayMs} />
            ))}
            <Skeleton className={cn(rowStyles.goalDifference, skeletonStyles.centeredNumber)} delayMs={delayMs} />
            <div className={cn(formSquaresStyles.row, rowStyles.wideOnly)}>
              {skeletonSlots(FORM_LENGTH).map((square) => (
                <Skeleton key={square.slotId} className={skeletonStyles.formSquare} delayMs={delayMs} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
