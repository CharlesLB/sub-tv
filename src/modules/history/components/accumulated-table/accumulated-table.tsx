import Link from 'next/link'
import { categoryLabel, categoryTextClass } from '@/modules/championships/client'
import { cn } from '@/lib/utils/cn'
import type { HistoryFilter } from '../../history-filter/history-filter'
import { historyHref } from '../../history-href/history-href'
import { formatPercent, formatPosition, formatSignedNumber } from '../../stat-format/stat-format'
import type { AccumulatedTeamRowVM } from '../../types'
import { HistoryEmptyState } from '../history-empty-state/history-empty-state'
import { HistorySection } from '../history-section/history-section'
import { RowChevron } from '../row-chevron/row-chevron'

const ROW_DELAY_STEP_MS = 30
const MAX_ROW_DELAY_MS = 400
const NUMBER_CELL = 'flex-none text-right text-[11.5px] tracking-[.04em] text-tx3 nums'
const HEADER_CELL = 'flex-none text-right'

type AccumulatedTableProps = { rows: AccumulatedTeamRowVM[]; filter: HistoryFilter }

export function AccumulatedTable({ rows, filter }: AccumulatedTableProps) {
  return (
    <HistorySection title="Classificação acumulada por time" className="pt-[22px]">
      {rows.length === 0 ? (
        <HistoryEmptyState message="Nenhuma campanha registrada para os filtros selecionados" />
      ) : (
        <div className="flex flex-col overflow-x-auto rounded-card border border-bd bg-pan">
          <div className="flex items-center gap-[10px] border-b border-bd2 px-3 pt-[6px] pb-2 text-[10px] tracking-[.05em] text-tx4 mobile:gap-2 mobile:px-[10px]">
            <span className="w-[26px] flex-none">#</span>
            <span className="w-[9px] flex-none" />
            <span className="flex-1">Time</span>
            <span className="w-[54px] flex-none mobile:hidden">Cat</span>
            <span className={cn(HEADER_CELL, 'w-[38px]')}>J</span>
            <span className={cn(HEADER_CELL, 'w-[34px] mobile:hidden')}>V</span>
            <span className={cn(HEADER_CELL, 'w-[34px] mobile:hidden')}>E</span>
            <span className={cn(HEADER_CELL, 'w-[34px] mobile:hidden')}>D</span>
            <span className={cn(HEADER_CELL, 'w-[44px]')}>SG</span>
            <span className={cn(HEADER_CELL, 'w-[46px]')}>PTS</span>
            <span className={cn(HEADER_CELL, 'w-[52px] mobile:hidden')}>APR</span>
            <span className="w-5 flex-none" />
          </div>
          {rows.map((row, index) => (
            <Link
              key={row.teamKey}
              href={historyHref({ kind: 'team', teamKey: row.teamKey }, filter)}
              title="Abrir a página do time"
              className={cn(
                'flex w-full animate-fade-up items-center gap-[10px] border-l-[3px] px-3 py-[10px] mobile:gap-2 mobile:px-[10px] text-left transition-colors duration-150 hover:bg-pan2',
                index % 2 === 1 ? 'bg-pan0' : 'bg-pan',
                index === 0 ? 'border-ac' : 'border-transparent',
              )}
              style={{ animationDelay: `${Math.min(MAX_ROW_DELAY_MS, index * ROW_DELAY_STEP_MS)}ms` }}
            >
              <span className={cn('w-[26px] flex-none text-[11px] tracking-[.04em] nums', index === 0 ? 'text-ac' : 'text-tx4')}>{formatPosition(index + 1)}</span>
              <span className="size-[9px] flex-none" style={{ background: row.team.color }} />
              <span className="min-w-0 flex-1 truncate text-[13.5px] font-bold tracking-[-.01em] text-tx">{row.team.name}</span>
              <span className={cn('w-[54px] flex-none text-[9.5px] tracking-[.06em] mobile:hidden', categoryTextClass[row.category])}>{categoryLabel[row.category]}</span>
              <span className={cn(NUMBER_CELL, 'w-[38px]')}>{row.played}</span>
              <span className={cn(NUMBER_CELL, 'w-[34px] mobile:hidden')}>{row.wins}</span>
              <span className={cn(NUMBER_CELL, 'w-[34px] mobile:hidden')}>{row.draws}</span>
              <span className={cn(NUMBER_CELL, 'w-[34px] mobile:hidden')}>{row.losses}</span>
              <span className={cn(NUMBER_CELL, 'w-[44px]')}>{formatSignedNumber(row.goalDifference)}</span>
              <span className={cn(NUMBER_CELL, 'w-[46px] text-[13px] font-bold text-tx')}>{row.points}</span>
              <span className={cn(NUMBER_CELL, 'w-[52px] text-[10.5px] text-tx4 mobile:hidden')}>{formatPercent(row.winRate)}</span>
              <RowChevron />
            </Link>
          ))}
        </div>
      )}
    </HistorySection>
  )
}
