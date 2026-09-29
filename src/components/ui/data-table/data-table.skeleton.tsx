import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import { skeletonSlots } from '@/lib/utils/skeleton-slots/skeleton-slots'
import { DataTable, type DataTableColumn } from './data-table'

export type DataTableStripeClassNames = { even: string; odd: string }

type DataTableSkeletonProps = {
  label: string
  columns: readonly DataTableColumn[]
  rowCount: number
  rowClassName: string
  stripeClassNames: DataTableStripeClassNames
  renderCells: (order: number) => ReactNode
}

export function DataTableSkeleton({ label, columns, rowCount, rowClassName, stripeClassNames, renderCells }: DataTableSkeletonProps) {
  return (
    <div aria-hidden>
      <DataTable label={label} columns={columns}>
        {skeletonSlots(rowCount).map(({ slotId, order }) => (
          <tr key={slotId} className={cn(rowClassName, order % 2 === 1 ? stripeClassNames.odd : stripeClassNames.even)}>
            {renderCells(order)}
          </tr>
        ))}
      </DataTable>
    </div>
  )
}
