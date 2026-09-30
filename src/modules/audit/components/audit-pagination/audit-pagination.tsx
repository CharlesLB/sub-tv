import Link from 'next/link'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui/icon/icon'
import { type AuditFilter, toAuditRouteQuery } from '../../lib/audit-filter/audit-filter'
import { auditPaginationStyles as styles } from './audit-pagination.styles'

type AuditPaginationProps = { filter: AuditFilter; hasNextPage: boolean }

export function AuditPagination({ filter, hasNextPage }: AuditPaginationProps) {
  const hasPreviousPage = filter.page > 1
  if (!hasPreviousPage && !hasNextPage) return null

  return (
    <nav aria-label="Paginação" className={styles.navigation}>
      <Link
        href={routes.auditLog(toAuditRouteQuery({ ...filter, page: filter.page - 1 }))}
        aria-disabled={!hasPreviousPage}
        tabIndex={hasPreviousPage ? undefined : -1}
        className={cn(styles.pageLink, !hasPreviousPage && styles.pageLinkDisabled)}
      >
        <Icon name="chevronLeft" size={16} />
        Anteriores
      </Link>
      <span className={styles.currentPage}>{`Página ${filter.page}`}</span>
      <Link
        href={routes.auditLog(toAuditRouteQuery({ ...filter, page: filter.page + 1 }))}
        aria-disabled={!hasNextPage}
        tabIndex={hasNextPage ? undefined : -1}
        className={cn(styles.pageLink, !hasNextPage && styles.pageLinkDisabled)}
      >
        Mais antigas
        <Icon name="chevronRight" size={16} />
      </Link>
    </nav>
  )
}
