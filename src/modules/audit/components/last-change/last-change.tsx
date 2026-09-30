import { Icon } from '@/components/ui/icon/icon'
import { getLastChange } from '../../data/get-last-change'
import type { AuditEntity } from '../../lib/audit-action/audit-action'
import { formatAuditTime } from '../../lib/format-audit-time/format-audit-time'
import { lastChangeStyles as styles } from './last-change.styles'

type LastChangeProps = { entityType: AuditEntity; entityId: string }

export async function LastChange({ entityType, entityId }: LastChangeProps) {
  const lastChange = await getLastChange(entityType, entityId)
  if (!lastChange) return null

  return (
    <p className={styles.line} title={lastChange.actionLabel}>
      <Icon name="history" size={14} className={styles.icon} />
      <span className={styles.text}>{`Última alteração: ${lastChange.userName} · ${formatAuditTime(lastChange.createdAt)}`}</span>
    </p>
  )
}
