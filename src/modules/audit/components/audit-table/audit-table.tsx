import { cn } from '@/lib/utils/cn'
import { formatAuditTime } from '../../format-audit-time/format-audit-time'
import type { AuditRowVM } from '../../types'

const ROW_DELAY_STEP_MS = 12
const MAX_ROW_DELAY_MS = 300
const HEADER_CELL = 'flex-none'

export function AuditTable({ rows }: { rows: AuditRowVM[] }) {
  if (rows.length === 0) {
    return (
      <div className="flex min-h-11 items-center justify-center rounded-card border border-dashed border-bd2 px-4 py-3 text-center text-[10.8px] font-bold tracking-[-.01em] text-tx4">
        Nenhuma alteração encontrada para os filtros selecionados
      </div>
    )
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-card border border-bd bg-pan" role="table" aria-label="Registro de alterações">
      <div role="row" className="flex items-center gap-3 border-b border-bd2 px-3 pt-[9px] pb-2 text-[10px] tracking-[.05em] text-tx4 mobile:hidden">
        <span role="columnheader" className={cn(HEADER_CELL, 'w-[118px]')}>
          Quando
        </span>
        <span role="columnheader" className={cn(HEADER_CELL, 'w-[140px]')}>
          Quem
        </span>
        <span role="columnheader" className={cn(HEADER_CELL, 'w-[190px]')}>
          O quê
        </span>
        <span role="columnheader" className="min-w-0 flex-1">
          Onde
        </span>
        <span role="columnheader" className="min-w-0 flex-1 compact:hidden">
          Detalhes
        </span>
      </div>
      {rows.map((row, index) => (
        <div
          key={row.id}
          role="row"
          className={cn('flex animate-fade-up items-center gap-3 px-3 py-[10px] mobile:flex-wrap mobile:gap-x-3 mobile:gap-y-1', index % 2 === 1 ? 'bg-pan0' : 'bg-pan')}
          style={{ animationDelay: `${Math.min(MAX_ROW_DELAY_MS, index * ROW_DELAY_STEP_MS)}ms` }}
        >
          <span role="cell" className="w-[118px] flex-none text-[11px] tracking-[.04em] text-tx3 nums mobile:w-auto">
            {formatAuditTime(row.createdAt)}
          </span>
          <span role="cell" className="w-[140px] flex-none truncate text-[12.6px] font-bold tracking-[-.01em] text-tx mobile:w-auto">
            {row.userName}
          </span>
          <span role="cell" className="w-[190px] flex-none truncate text-[12px] text-tx1 mobile:w-full">
            {row.actionLabel}
          </span>
          <span role="cell" className="flex min-w-0 flex-1 flex-col gap-[2px] mobile:w-full mobile:flex-none">
            {row.entityLabel ? <span className="text-[9.5px] tracking-[.06em] text-tx5">{row.entityLabel}</span> : null}
            <span className="truncate text-[11.7px] font-bold tracking-[-.01em] text-tx2">{row.entityDescription ?? '—'}</span>
          </span>
          <span role="cell" className="min-w-0 flex-1 truncate text-[10.5px] tracking-[.03em] text-tx4 compact:hidden" title={row.detailsSummary}>
            {row.detailsSummary}
          </span>
        </div>
      ))}
    </div>
  )
}
