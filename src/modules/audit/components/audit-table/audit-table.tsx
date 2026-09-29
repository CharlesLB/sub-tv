import { cn } from '@/lib/utils/cn'
import { DataTable, type DataTableColumn } from '@/components/ui/data-table/data-table'
import { formatAuditTime } from '../../format-audit-time/format-audit-time'
import type { AuditRowVM } from '../../types'
import { auditTableStyles as styles } from './audit-table.styles'

const ROW_DELAY_STEP_MS = 12
const MAX_ROW_DELAY_MS = 300
const MISSING_ENTITY_DESCRIPTION = '—'

export const AUDIT_TABLE_LABEL = 'Registro de alterações'

export const AUDIT_TABLE_COLUMNS: readonly DataTableColumn[] = [
  { id: 'time', label: 'Quando', className: styles.timeHeader },
  { id: 'user', label: 'Quem', className: styles.userHeader },
  { id: 'action', label: 'O quê', className: styles.actionHeader },
  { id: 'entity', label: 'Onde', className: styles.entityHeader },
  { id: 'details', label: 'Detalhes', className: styles.detailsHeader },
]

export function AuditTable({ rows }: { rows: AuditRowVM[] }) {
  if (rows.length === 0) {
    return <div className={styles.emptyState}>Nenhuma alteração encontrada para os filtros selecionados</div>
  }

  return (
    <DataTable label={AUDIT_TABLE_LABEL} columns={AUDIT_TABLE_COLUMNS}>
      {rows.map((row, index) => (
        <tr key={row.id} className={cn(styles.row, index % 2 === 1 ? styles.rowOdd : styles.rowEven)} style={{ animationDelay: `${Math.min(MAX_ROW_DELAY_MS, index * ROW_DELAY_STEP_MS)}ms` }}>
          <td className={styles.timeCell}>{formatAuditTime(row.createdAt)}</td>
          <td className={styles.userCell}>{row.userName}</td>
          <td className={styles.actionCell}>{row.actionLabel}</td>
          <td className={styles.entityCell}>
            {row.entityLabel ? <span className={styles.entityLabel}>{row.entityLabel}</span> : null}
            <span className={styles.entityDescription}>{row.entityDescription ?? MISSING_ENTITY_DESCRIPTION}</span>
          </td>
          <td className={styles.detailsCell} title={row.detailsSummary}>
            {row.detailsSummary}
          </td>
        </tr>
      ))}
    </DataTable>
  )
}
