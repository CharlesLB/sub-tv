import { z } from 'zod'
import type { AuditAction, AuditEntity } from '../audit-action/audit-action'
import { isAuditAction, isAuditEntity } from '../audit-labels/audit-labels'

export const AUDIT_PERIOD = { TODAY: 'hoje', WEEK: '7d', MONTH: '30d', ALL: 'tudo' } as const

export type AuditPeriod = (typeof AUDIT_PERIOD)[keyof typeof AUDIT_PERIOD]

export const AUDIT_PERIOD_LABEL: Record<AuditPeriod, string> = {
  [AUDIT_PERIOD.TODAY]: 'Últimas 24 horas',
  [AUDIT_PERIOD.WEEK]: 'Últimos 7 dias',
  [AUDIT_PERIOD.MONTH]: 'Últimos 30 dias',
  [AUDIT_PERIOD.ALL]: 'Todo o período',
}

export const AUDIT_PERIODS: readonly AuditPeriod[] = Object.values(AUDIT_PERIOD)

const PERIOD_DAYS: Record<AuditPeriod, number | null> = {
  [AUDIT_PERIOD.TODAY]: 1,
  [AUDIT_PERIOD.WEEK]: 7,
  [AUDIT_PERIOD.MONTH]: 30,
  [AUDIT_PERIOD.ALL]: null,
}

const MILLISECONDS_PER_DAY = 86_400_000
const FIRST_PAGE = 1

export type AuditFilter = {
  userId: string | null
  action: AuditAction | null
  entityType: AuditEntity | null
  period: AuditPeriod
  page: number
}

type SearchParamValue = string | string[] | undefined

export type AuditQuery = { user: SearchParamValue; action: SearchParamValue; entity: SearchParamValue; period: SearchParamValue; page: SearchParamValue }

const Uuid = z.uuid()
const PageNumber = z.coerce.number().int().min(FIRST_PAGE)

const firstValue = (value: SearchParamValue): string | undefined => (Array.isArray(value) ? value[0] : value)

const isAuditPeriod = (value: unknown): value is AuditPeriod => AUDIT_PERIODS.some((period) => period === value)

export const parseAuditFilter = (query: AuditQuery): AuditFilter => {
  const user = Uuid.safeParse(firstValue(query.user))
  const action = firstValue(query.action)
  const entity = firstValue(query.entity)
  const period = firstValue(query.period)
  const page = PageNumber.safeParse(firstValue(query.page))

  return {
    userId: user.success ? user.data : null,
    action: isAuditAction(action) ? action : null,
    entityType: isAuditEntity(entity) ? entity : null,
    period: isAuditPeriod(period) ? period : AUDIT_PERIOD.ALL,
    page: page.success ? page.data : FIRST_PAGE,
  }
}

export const periodStart = (period: AuditPeriod, now: Date): Date | null => {
  const days = PERIOD_DAYS[period]

  return days === null ? null : new Date(now.getTime() - days * MILLISECONDS_PER_DAY)
}

export const toAuditRouteQuery = (filter: AuditFilter) => ({
  userId: filter.userId ?? undefined,
  action: filter.action ?? undefined,
  entityType: filter.entityType ?? undefined,
  period: filter.period === AUDIT_PERIOD.ALL ? undefined : filter.period,
  page: filter.page === FIRST_PAGE ? undefined : filter.page,
})
