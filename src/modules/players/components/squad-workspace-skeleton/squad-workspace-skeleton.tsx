import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { ROSTER_COLUMNS } from '../../roster-columns/roster-columns'
import { squadWorkspaceSkeletonStyles as styles } from './squad-workspace-skeleton.styles'

const ROW_PLACEHOLDERS = [
  { id: 'first', nameWidth: '64%' },
  { id: 'second', nameWidth: '52%' },
  { id: 'third', nameWidth: '72%' },
  { id: 'fourth', nameWidth: '58%' },
  { id: 'fifth', nameWidth: '66%' },
  { id: 'sixth', nameWidth: '48%' },
] as const

const HEADER_CELL_KEYS = ROSTER_COLUMNS.map((column) => column.key)
const ROW_DELAY_MS = 80
const CELL_DELAY_MS = 50
const FADED_ROW_START = 4
const NAME_COLUMN_INDEX = 1
const LAST_COLUMN_INDEX = HEADER_CELL_KEYS.length - 1

export function SquadWorkspaceSkeleton() {
  return (
    <>
      <div aria-hidden className={styles.roster}>
        <div className={styles.header}>
          <Skeleton className={styles.headerCrest} />
          <span className={styles.headerTitles}>
            <Skeleton className={styles.headerTitle} delayMs={50} />
            <Skeleton className={styles.headerSubtitle} delayMs={100} />
          </span>
          <Skeleton className={styles.headerSearch} delayMs={150} />
          <Skeleton className={styles.headerButton} delayMs={200} />
        </div>
        <div className={cn(styles.grid, styles.columnHeader)}>
          {HEADER_CELL_KEYS.map((cellKey, index) => (
            <Skeleton key={cellKey} className={cn(styles.columnHeaderCell, index === NAME_COLUMN_INDEX ? styles.columnHeaderNameCell : null)} delayMs={index * CELL_DELAY_MS} />
          ))}
        </div>
        <div className={styles.rows}>
          {ROW_PLACEHOLDERS.map(({ id, nameWidth }, rowIndex) => {
            const delay = rowIndex * ROW_DELAY_MS
            const fillClass = rowIndex >= FADED_ROW_START ? styles.cellFaded : styles.cellFilled

            return (
              <div key={id} className={cn(styles.grid, styles.row)}>
                {HEADER_CELL_KEYS.map((cellKey, cellIndex) => (
                  <Skeleton
                    key={cellKey}
                    className={cn(
                      cellIndex === 0 ? styles.numberCell : cellIndex === NAME_COLUMN_INDEX ? styles.nameCell : styles.statCell,
                      cellIndex === LAST_COLUMN_INDEX ? styles.lastCell : null,
                      fillClass,
                    )}
                    delayMs={delay + cellIndex * CELL_DELAY_MS}
                    style={cellIndex === NAME_COLUMN_INDEX ? { width: nameWidth } : {}}
                  />
                ))}
              </div>
            )
          })}
        </div>
      </div>
      <div aria-hidden className={styles.sheet}>
        <div className={styles.sheetHeader}>
          <Skeleton className={styles.sheetCrest} />
          <Skeleton className={styles.sheetTitle} delayMs={50} />
          <Skeleton className={styles.sheetCategory} delayMs={100} />
        </div>
        <div className={styles.identityFields}>
          <span className={styles.field}>
            <Skeleton className={styles.numberLabel} delayMs={100} />
            <Skeleton className={styles.input} delayMs={150} />
          </span>
          <span className={styles.field}>
            <Skeleton className={styles.nameLabel} delayMs={150} />
            <Skeleton className={styles.input} delayMs={200} />
          </span>
        </div>
        <div className={styles.field}>
          <Skeleton className={styles.displayNameLabel} delayMs={200} />
          <Skeleton className={styles.input} delayMs={250} />
        </div>
        <div className={styles.chips}>
          <Skeleton className={styles.positionChip} delayMs={300} />
          <Skeleton className={styles.footChip} delayMs={350} />
          <Skeleton className={styles.teamChip} delayMs={400} />
        </div>
        <div className={styles.curiosities}>
          <Skeleton className={styles.curiositiesLabel} delayMs={400} />
          <Skeleton className={styles.firstCuriosity} delayMs={450} />
          <Skeleton className={styles.secondCuriosity} delayMs={500} />
        </div>
      </div>
    </>
  )
}
