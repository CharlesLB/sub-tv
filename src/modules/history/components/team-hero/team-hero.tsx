import { categoryLabel, categoryTextClass } from '@/modules/championships/client'
import { cn } from '@/lib/utils/cn'
import { formatPercent, pluralize } from '../../stat-format/stat-format'
import type { TeamHistoryVM } from '../../types'

export function TeamHero({ history }: { history: TeamHistoryVM }) {
  const subtitle = [
    `${pluralize(history.seasons.length, 'Temporada', 'Temporadas')} No filtro`,
    `${history.totals.played} Jogos`,
    `${formatPercent(history.totals.winRate)} de aproveitamento`,
  ].join(' · ')

  return (
    <div className="flex items-center gap-[14px] rounded-card border border-bd bg-pan px-[18px] py-4">
      <span className="flex size-[54px] flex-none items-center justify-center text-[18.9px] font-bold tracking-[-.01em] text-bg" style={{ background: history.team.color }}>
        {history.team.abbreviation}
      </span>
      <div className="flex min-w-0 flex-col gap-[5px]">
        <div className="flex flex-wrap items-baseline gap-[10px]">
          <span className="text-[24.3px] leading-[1.05] font-bold tracking-[-.01em] text-tx">{history.team.name}</span>
          <span className={cn('text-[11px] tracking-[.05em]', categoryTextClass[history.category])}>{categoryLabel[history.category]}</span>
        </div>
        <span className="text-[10px] tracking-[.1em] text-tx4">{subtitle}</span>
      </div>
    </div>
  )
}
