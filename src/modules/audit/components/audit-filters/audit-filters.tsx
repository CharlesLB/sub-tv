import Form from 'next/form'
import Link from 'next/link'
import { ACTION_PARAMETER, ENTITY_PARAMETER, PERIOD_PARAMETER, routes, USER_PARAMETER } from '@/lib/routes'
import { FormPendingIndicator } from '@/components/ui/form-pending-indicator/form-pending-indicator'
import { LinkPendingIndicator } from '@/components/ui/link-pending-indicator/link-pending-indicator'
import { AUDIT_PERIOD_LABEL, AUDIT_PERIODS, type AuditFilter } from '../../lib/audit-filter/audit-filter'
import { AUDIT_ACTION_LABEL, AUDIT_ACTIONS, AUDIT_ENTITIES, AUDIT_ENTITY_LABEL } from '../../lib/audit-labels/audit-labels'
import type { AuditUserOptionVM } from '../../types'
import { auditFiltersStyles as styles } from './audit-filters.styles'

const ANY_VALUE = ''

type AuditFiltersProps = { filter: AuditFilter; users: AuditUserOptionVM[] }

const fieldValuesOf = (filter: AuditFilter): string => JSON.stringify([filter.userId, filter.action, filter.period, filter.entityType])

export function AuditFilters({ filter, users }: AuditFiltersProps) {
  return (
    <Form key={fieldValuesOf(filter)} action={routes.auditLog()} className={styles.form}>
      <label className={styles.label}>
        Usuário
        <select name={USER_PARAMETER} defaultValue={filter.userId ?? ANY_VALUE} className={styles.field}>
          <option value={ANY_VALUE}>Todos</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.label}>
        Ação
        <select name={ACTION_PARAMETER} defaultValue={filter.action ?? ANY_VALUE} className={styles.field}>
          <option value={ANY_VALUE}>Todas</option>
          {AUDIT_ACTIONS.map((action) => (
            <option key={action} value={action}>
              {AUDIT_ACTION_LABEL[action]}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.label}>
        Período
        <select name={PERIOD_PARAMETER} defaultValue={filter.period} className={styles.field}>
          {AUDIT_PERIODS.map((period) => (
            <option key={period} value={period}>
              {AUDIT_PERIOD_LABEL[period]}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.label}>
        Entidade
        <select name={ENTITY_PARAMETER} defaultValue={filter.entityType ?? ANY_VALUE} className={styles.field}>
          <option value={ANY_VALUE}>Todas</option>
          {AUDIT_ENTITIES.map((entity) => (
            <option key={entity} value={entity}>
              {AUDIT_ENTITY_LABEL[entity]}
            </option>
          ))}
        </select>
      </label>
      <div className={styles.actions}>
        <button type="submit" className={styles.submitButton}>
          Filtrar
        </button>
        <Link href={routes.auditLog()} className={styles.clearLink}>
          Limpar
          <LinkPendingIndicator />
        </Link>
      </div>
      <FormPendingIndicator />
    </Form>
  )
}
