import { cn } from '@/lib/utils/cn'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table.skeleton'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { USERS_TABLE_COLUMNS, USERS_TABLE_LABEL } from './users-table'
import { usersTableSkeletonStyles as skeletonStyles } from './users-table.skeleton.styles'
import { usersTableStyles as styles } from './users-table.styles'

const ROW_COUNT = 3
const ROW_DELAY_MS = 60
const CELL_DELAY_MS = 30

const renderCells = (order: number) => {
  const delay = order * ROW_DELAY_MS

  return (
    <>
      <td className={styles.nameCell}>
        <span className={styles.username}>
          <Skeleton className={cn(skeletonStyles.textBar, skeletonStyles.usernameWidth)} delayMs={delay} />
        </span>
      </td>
      <td className={styles.statusCell}>
        <Skeleton className={cn(skeletonStyles.textBar, skeletonStyles.statusWidth)} delayMs={delay + CELL_DELAY_MS} />
      </td>
      <td className={styles.lastSignInCell}>
        <Skeleton className={cn(skeletonStyles.textBar, skeletonStyles.lastSignInWidth)} delayMs={delay + CELL_DELAY_MS * 2} />
      </td>
      <td className={styles.actionsCell}>
        <Skeleton className={skeletonStyles.resetPasswordButton} delayMs={delay + CELL_DELAY_MS * 3} />
        <Skeleton className={skeletonStyles.activeToggleButton} delayMs={delay + CELL_DELAY_MS * 3} />
      </td>
    </>
  )
}

export function UsersTableSkeleton() {
  return (
    <DataTableSkeleton
      label={USERS_TABLE_LABEL}
      columns={USERS_TABLE_COLUMNS}
      rowCount={ROW_COUNT}
      rowClassName={styles.row}
      stripeClassNames={{ even: styles.rowEven, odd: styles.rowOdd }}
      renderCells={renderCells}
    />
  )
}
