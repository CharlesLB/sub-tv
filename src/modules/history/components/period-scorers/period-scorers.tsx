import Link from 'next/link'
import { categoryLabel } from '@/modules/championships/client'
import { cn } from '@/lib/utils/cn'
import type { HistoryFilter } from '../../history-filter/history-filter'
import { historyHref } from '../../history-href/history-href'
import { barWidthPercent, formatPosition } from '../../stat-format/stat-format'
import type { PeriodScorerVM } from '../../types'
import { HistoryEmptyState } from '../history-empty-state/history-empty-state'
import { HistorySection } from '../history-section/history-section'
import { RowChevron } from '../row-chevron/row-chevron'

const ROW_DELAY_STEP_MS = 40
const MAX_ROW_DELAY_MS = 400

const seasonCountLabel = (seasonCount: number): string => `${seasonCount} ${seasonCount === 1 ? 'Temp.' : 'Temps.'}`

type PeriodScorersProps = { scorers: PeriodScorerVM[]; filter: HistoryFilter }

export function PeriodScorers({ scorers, filter }: PeriodScorersProps) {
  const topGoals = scorers[0]?.goals ?? 1

  return (
    <HistorySection title="Artilheiros do período" className="max-w-[720px]">
      {scorers.length === 0 ? (
        <HistoryEmptyState message="Nenhum gol registrado para os filtros selecionados" />
      ) : (
        <div className="flex flex-col overflow-hidden rounded-card border border-bd bg-pan">
          {scorers.map((scorer, index) => (
            <Link
              key={`${scorer.playerId}-${scorer.category}`}
              href={historyHref({ kind: 'athlete', playerId: scorer.playerId }, filter)}
              title="Abrir a ficha do atleta"
              className={cn('flex w-full animate-fade-up items-center gap-[11px] px-3 py-[9px] text-left transition-colors duration-150 hover:bg-pan2', index % 2 === 1 ? 'bg-pan0' : 'bg-pan')}
              style={{ animationDelay: `${Math.min(MAX_ROW_DELAY_MS, index * ROW_DELAY_STEP_MS)}ms` }}
            >
              <span className={cn('w-6 flex-none text-[11px] nums', index === 0 ? 'text-ac' : 'text-tx5')}>{formatPosition(index + 1)}</span>
              <span className="size-[9px] flex-none" style={{ background: scorer.team.color }} />
              <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                <span className="truncate text-[12.6px] font-bold tracking-[-.01em] text-tx">{scorer.name}</span>
                <span className="truncate text-[9.5px] tracking-[.08em] text-tx4">{`${scorer.team.name} · ${categoryLabel[scorer.category]}`}</span>
              </span>
              <span className="h-1 w-[72px] flex-none bg-bd mobile:hidden">
                <span className="block h-full transition-[width] duration-400" style={{ width: `${barWidthPercent(scorer.goals, topGoals)}%`, background: scorer.team.color }} />
              </span>
              <span className="w-[30px] flex-none text-right text-[15.3px] font-bold text-tx nums">{scorer.goals}</span>
              <span className="w-[62px] flex-none text-right text-[9.5px] tracking-[.08em] text-tx5 mobile:hidden">{seasonCountLabel(scorer.seasonCount)}</span>
              <RowChevron />
            </Link>
          ))}
        </div>
      )}
    </HistorySection>
  )
}
