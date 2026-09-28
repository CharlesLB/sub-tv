import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import { dataTableStyles as styles } from './data-table.styles'

export type DataTableColumn = { id: string; label: string; className: string }

type DataTableProps = { label: string; columns: readonly DataTableColumn[]; children?: ReactNode }

export function DataTable({ label, columns, children }: DataTableProps) {
  return (
    <table aria-label={label} className={styles.table}>
      <thead>
        <tr className={styles.headerRow}>
          {columns.map((column) => (
            <th key={column.id} scope="col" className={cn(styles.headerCell, column.className)}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  )
}
