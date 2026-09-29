import { cn } from '@/lib/utils/cn'
import { skeletonSlots } from '@/lib/utils/skeleton-slots/skeleton-slots'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { ROSTER_COLUMNS } from '../../roster-columns/roster-columns'
import { rosterRowStyles } from '../roster-row/roster-row.styles'
import { rosterTableSkeletonStyles as skeletonStyles } from './roster-table.skeleton.styles'
import { rosterTableStyles as styles } from './roster-table.styles'

type RosterColumnKey = (typeof ROSTER_COLUMNS)[number]['key']

const ROW_PLACEHOLDER_COUNT = 12
const ROW_DELAY_MS = 60
const CELL_DELAY_MS = 30
const NAME_COLUMN_KEY: RosterColumnKey = 'name'
const LAST_COLUMN_INDEX = ROSTER_COLUMNS.length - 1

const CELL_CLASSES: Record<RosterColumnKey, string> = {
  number: rosterRowStyles.shirtNumber,
  name: rosterRowStyles.name,
  position: rosterRowStyles.position,
  games: rosterRowStyles.stat,
  goals: rosterRowStyles.stat,
  curiosities: cn(rosterRowStyles.stat, rosterRowStyles.curiosityCount),
}

const cellWidthOf = (columnKey: RosterColumnKey, order: number): string =>
  columnKey === NAME_COLUMN_KEY ? (skeletonStyles.nameWidths[order % skeletonStyles.nameWidths.length] ?? skeletonStyles.cellWidths.name) : skeletonStyles.cellWidths[columnKey]

export function RosterTableSkeleton() {
  return (
    <>
      <div aria-hidden className={cn(styles.grid, styles.header)}>
        {ROSTER_COLUMNS.map((column, index) => (
          <span key={column.key} className={cn(styles.columnLabel, index === LAST_COLUMN_INDEX ? styles.lastColumnLabel : styles.columnLabelAligned)}>
            <Skeleton className={cn(skeletonStyles.textBar, skeletonStyles.columnLabelWidths[column.key])} delayMs={index * CELL_DELAY_MS} />
          </span>
        ))}
      </div>
      <div aria-hidden className={cn(styles.rows, skeletonStyles.rowsWithoutScroll)}>
        {skeletonSlots(ROW_PLACEHOLDER_COUNT).map(({ slotId, order }) => (
          <div key={slotId} className={cn(rosterRowStyles.grid, rosterRowStyles.row)}>
            {ROSTER_COLUMNS.map((column, index) => (
              <span key={column.key} className={CELL_CLASSES[column.key]}>
                <Skeleton className={cn(skeletonStyles.textBar, cellWidthOf(column.key, order))} delayMs={order * ROW_DELAY_MS + index * CELL_DELAY_MS} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
