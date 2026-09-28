import { cn } from '@/lib/utils/cn'
import { formatAuditTime } from '../../format-audit-time/format-audit-time'
import type { AuditRowVM } from '../../types'
import { auditTableStyles as styles } from './audit-table.styles'

const ROW_DELAY_STEP_MS = 12
const MAX_ROW_DELAY_MS = 300

export function AuditTable({ rows }: { rows: AuditRowVM[] }) {
  if (rows.length === 0) {
    return <div className={styles.emptyState}>Nenhuma alteração encontrada para os filtros selecionados</div>
  }

  return (
    <div className={styles.table} role="table" aria-label="Registro de alterações">
      <div role="row" className={styles.headerRow}>
        <span role="columnheader" className={cn(styles.fixedHeader, styles.timeHeader)}>
          Quando
        </span>
        <span role="columnheader" className={cn(styles.fixedHeader, styles.userHeader)}>
          Quem
        </span>
        <span role="columnheader" className={cn(styles.fixedHeader, styles.actionHeader)}>
          O quê
        </span>
        <span role="columnheader" className={styles.entityHeader}>
          Onde
        </span>
        <span role="columnheader" className={styles.detailsHeader}>
          Detalhes
        </span>
      </div>
      {rows.map((row, index) => (
        <div
          key={row.id}
          role="row"
          className={cn(styles.row, index % 2 === 1 ? styles.rowOdd : styles.rowEven)}
          style={{ animationDelay: `${Math.min(MAX_ROW_DELAY_MS, index * ROW_DELAY_STEP_MS)}ms` }}
        >
          <span role="cell" className={styles.timeCell}>
            {formatAuditTime(row.createdAt)}
          </span>
          <span role="cell" className={styles.userCell}>
            {row.userName}
          </span>
          <span role="cell" className={styles.actionCell}>
            {row.actionLabel}
          </span>
          <span role="cell" className={styles.entityCell}>
            {row.entityLabel ? <span className={styles.entityLabel}>{row.entityLabel}</span> : null}
            <span className={styles.entityDescription}>{row.entityDescription ?? '—'}</span>
          </span>
          <span role="cell" className={styles.detailsCell} title={row.detailsSummary}>
            {row.detailsSummary}
          </span>
        </div>
      ))}
    </div>
  )
}
