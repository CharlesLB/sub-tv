import { ACTION_PARAMETER, ENTITY_PARAMETER, PAGE_PARAMETER, PERIOD_PARAMETER, USER_PARAMETER } from '@/lib/routes'
import { parseAuditFilter } from '../../audit-filter/audit-filter'
import { getAuditEntries } from '../../data/get-audit-entries'
import { getAuditUserOptions } from '../../data/get-audit-user-options'
import { AuditFilters } from '../audit-filters/audit-filters'
import { AuditPagination } from '../audit-pagination/audit-pagination'
import { AuditTable } from '../audit-table/audit-table'

type AuditLogScreenProps = { query: Record<string, string | string[] | undefined> }

export async function AuditLogScreen({ query }: AuditLogScreenProps) {
  const filter = parseAuditFilter({
    user: query[USER_PARAMETER],
    action: query[ACTION_PARAMETER],
    entity: query[ENTITY_PARAMETER],
    period: query[PERIOD_PARAMETER],
    page: query[PAGE_PARAMETER],
  })

  const [users, entries] = await Promise.all([getAuditUserOptions(), getAuditEntries(filter)])

  return (
    <>
      <AuditFilters filter={filter} users={users} />
      <AuditTable rows={entries.rows} />
      <AuditPagination filter={filter} hasNextPage={entries.hasNextPage} />
    </>
  )
}
