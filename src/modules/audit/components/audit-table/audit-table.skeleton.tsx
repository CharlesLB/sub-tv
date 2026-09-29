import { cn } from '@/lib/utils/cn'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table.skeleton'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { AUDIT_TABLE_COLUMNS, AUDIT_TABLE_LABEL } from './audit-table'
import { auditTableSkeletonStyles as skeletonStyles } from './audit-table.skeleton.styles'
import { auditTableStyles as styles } from './audit-table.styles'

const ROW_COUNT = 10
const ROW_DELAY_MS = 50
const CELL_DELAY_MS = 30

const renderCells = (order: number) => {
  const delay = order * ROW_DELAY_MS

  return (
    <>
      <td className={styles.timeCell}>
        <Skeleton className={cn(skeletonStyles.textBar, skeletonStyles.timeWidth)} delayMs={delay} />
      </td>
      <td className={styles.userCell}>
        <Skeleton className={cn(skeletonStyles.textBar, skeletonStyles.userWidth)} delayMs={delay + CELL_DELAY_MS} />
      </td>
      <td className={styles.actionCell}>
        <Skeleton className={cn(skeletonStyles.textBar, skeletonStyles.actionWidth)} delayMs={delay + CELL_DELAY_MS * 2} />
      </td>
      <td className={styles.entityCell}>
        <span className={styles.entityLabel}>
          <Skeleton className={cn(skeletonStyles.textBar, skeletonStyles.entityLabelWidth)} delayMs={delay + CELL_DELAY_MS * 3} />
        </span>
        <span className={styles.entityDescription}>
          <Skeleton className={cn(skeletonStyles.textBar, skeletonStyles.entityDescriptionWidth)} delayMs={delay + CELL_DELAY_MS * 3} />
        </span>
      </td>
      <td className={styles.detailsCell}>
        <Skeleton className={cn(skeletonStyles.textBar, skeletonStyles.detailsWidth)} delayMs={delay + CELL_DELAY_MS * 4} />
      </td>
    </>
  )
}

export function AuditTableSkeleton() {
  return (
    <DataTableSkeleton
      label={AUDIT_TABLE_LABEL}
      columns={AUDIT_TABLE_COLUMNS}
      rowCount={ROW_COUNT}
      rowClassName={styles.row}
      stripeClassNames={{ even: styles.rowEven, odd: styles.rowOdd }}
      renderCells={renderCells}
    />
  )
}
