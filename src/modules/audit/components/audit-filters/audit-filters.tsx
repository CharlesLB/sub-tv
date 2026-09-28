import Form from 'next/form'
import Link from 'next/link'
import { ACTION_PARAMETER, ENTITY_PARAMETER, PERIOD_PARAMETER, USER_PARAMETER, routes } from '@/lib/routes'
import { AUDIT_ACTIONS, AUDIT_ACTION_LABEL, AUDIT_ENTITIES, AUDIT_ENTITY_LABEL } from '../../audit-labels/audit-labels'
import { AUDIT_PERIODS, AUDIT_PERIOD_LABEL, type AuditFilter } from '../../audit-filter/audit-filter'
import type { AuditUserOptionVM } from '../../types'

const AUDIT_PATH = '/registro'
const ANY_VALUE = ''
const FIELD_CLASS = 'h-[34px] w-full min-w-0 rounded-card border border-bd2 bg-pan px-[10px] text-[12px] text-tx'
const LABEL_CLASS = 'flex min-w-0 flex-col gap-[5px] text-[9.5px] tracking-[.05em] text-tx5'

type AuditFiltersProps = { filter: AuditFilter; users: AuditUserOptionVM[] }

export function AuditFilters({ filter, users }: AuditFiltersProps) {
  return (
    <Form action={AUDIT_PATH} className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] items-end gap-[10px] rounded-card border border-bd bg-pan p-[14px]">
      <label className={LABEL_CLASS}>
        Usuário
        <select name={USER_PARAMETER} defaultValue={filter.userId ?? ANY_VALUE} className={FIELD_CLASS}>
          <option value={ANY_VALUE}>Todos</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </label>
      <label className={LABEL_CLASS}>
        Ação
        <select name={ACTION_PARAMETER} defaultValue={filter.action ?? ANY_VALUE} className={FIELD_CLASS}>
          <option value={ANY_VALUE}>Todas</option>
          {AUDIT_ACTIONS.map((action) => (
            <option key={action} value={action}>
              {AUDIT_ACTION_LABEL[action]}
            </option>
          ))}
        </select>
      </label>
      <label className={LABEL_CLASS}>
        Período
        <select name={PERIOD_PARAMETER} defaultValue={filter.period} className={FIELD_CLASS}>
          {AUDIT_PERIODS.map((period) => (
            <option key={period} value={period}>
              {AUDIT_PERIOD_LABEL[period]}
            </option>
          ))}
        </select>
      </label>
      <label className={LABEL_CLASS}>
        Entidade
        <select name={ENTITY_PARAMETER} defaultValue={filter.entityType ?? ANY_VALUE} className={FIELD_CLASS}>
          <option value={ANY_VALUE}>Todas</option>
          {AUDIT_ENTITIES.map((entity) => (
            <option key={entity} value={entity}>
              {AUDIT_ENTITY_LABEL[entity]}
            </option>
          ))}
        </select>
      </label>
      <div className="flex items-center gap-2">
        <button type="submit" className="h-[34px] flex-1 rounded-card bg-ac px-4 text-[11.5px] font-bold tracking-[-.01em] text-bg">
          Filtrar
        </button>
        <Link
          href={routes.auditLog()}
          className="flex h-[34px] flex-none items-center rounded-card border border-bd2 px-3 text-[11px] font-bold tracking-[-.01em] text-tx3 hover:border-tx3 hover:text-tx"
        >
          Limpar
        </Link>
      </div>
    </Form>
  )
}
