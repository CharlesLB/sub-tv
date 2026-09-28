import { Icon } from '@/components/ui/icon/icon'
import type { AuditEntity } from '../../audit-action'
import { getLastChange } from '../../data/get-last-change'
import { formatAuditTime } from '../../format-audit-time/format-audit-time'

type LastChangeProps = { entityType: AuditEntity; entityId: string }

export async function LastChange({ entityType, entityId }: LastChangeProps) {
  const lastChange = await getLastChange(entityType, entityId)
  if (!lastChange) return null

  return (
    <p className="m-0 flex min-w-0 items-center gap-[6px] text-[10px] tracking-[.05em] text-tx4" title={lastChange.actionLabel}>
      <Icon name="history" size={14} className="text-tx5" />
      <span className="truncate">{`Última alteração: ${lastChange.userName} · ${formatAuditTime(lastChange.createdAt)}`}</span>
    </p>
  )
}
