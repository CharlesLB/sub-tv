import { AuditFiltersSkeleton } from '../audit-filters/audit-filters.skeleton'
import { AuditPaginationSkeleton } from '../audit-pagination/audit-pagination.skeleton'
import { AuditTableSkeleton } from '../audit-table/audit-table.skeleton'

export function AuditLogSkeleton() {
  return (
    <>
      <AuditFiltersSkeleton />
      <AuditTableSkeleton />
      <AuditPaginationSkeleton />
    </>
  )
}
