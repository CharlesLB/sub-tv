import Link from 'next/link'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui/icon/icon'
import { type AuditFilter, toAuditRouteQuery } from '../../audit-filter/audit-filter'

const PAGE_LINK = 'flex h-8 items-center gap-[6px] rounded-card border border-bd2 px-3 text-[10.5px] tracking-[.05em] text-tx3 transition-colors hover:border-tx3 hover:text-tx'
const DISABLED_PAGE_LINK = 'pointer-events-none opacity-40'

type AuditPaginationProps = { filter: AuditFilter; hasNextPage: boolean }

export function AuditPagination({ filter, hasNextPage }: AuditPaginationProps) {
  const hasPreviousPage = filter.page > 1
  if (!hasPreviousPage && !hasNextPage) return null

  return (
    <nav aria-label="Paginação" className="flex items-center justify-between gap-3">
      <Link
        href={routes.auditLog(toAuditRouteQuery({ ...filter, page: filter.page - 1 }))}
        aria-disabled={!hasPreviousPage}
        tabIndex={hasPreviousPage ? undefined : -1}
        className={cn(PAGE_LINK, !hasPreviousPage && DISABLED_PAGE_LINK)}
      >
        <Icon name="chevronLeft" size={16} />
        Anteriores
      </Link>
      <span className="text-[10.5px] tracking-[.05em] text-tx4 nums">{`Página ${filter.page}`}</span>
      <Link
        href={routes.auditLog(toAuditRouteQuery({ ...filter, page: filter.page + 1 }))}
        aria-disabled={!hasNextPage}
        tabIndex={hasNextPage ? undefined : -1}
        className={cn(PAGE_LINK, !hasNextPage && DISABLED_PAGE_LINK)}
      >
        Mais antigas
        <Icon name="chevronRight" size={16} />
      </Link>
    </nav>
  )
}
