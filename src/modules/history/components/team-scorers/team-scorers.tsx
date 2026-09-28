import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import type { HistoryFilter } from '../../history-filter/history-filter'
import { historyHref } from '../../history-href/history-href'
import { barWidthPercent, formatPosition } from '../../stat-format/stat-format'
import type { TeamScorerVM } from '../../types'
import { HistoryEmptyState } from '../history-empty-state/history-empty-state'
import { HistorySection } from '../history-section/history-section'

const ROW_DELAY_STEP_MS = 40
const MAX_ROW_DELAY_MS = 400

type TeamScorersProps = { scorers: TeamScorerVM[]; color: string; filter: HistoryFilter }

export function TeamScorers({ scorers, color, filter }: TeamScorersProps) {
  const topGoals = scorers[0]?.goals ?? 1

  return (
    <HistorySection title="Artilheiros do time">
      {scorers.length === 0 ? (
        <HistoryEmptyState message="Nenhum gol do time nos filtros selecionados" />
      ) : (
        <div className="flex flex-col overflow-hidden rounded-card border border-bd bg-pan">
          {scorers.map((scorer, index) => (
            <Link
              key={scorer.playerId}
              href={historyHref({ kind: 'athlete', playerId: scorer.playerId }, filter)}
              title="Abrir a ficha do atleta"
              className={cn('flex animate-fade-up items-center gap-3 px-3 py-[9px] transition-colors duration-150 hover:bg-pan2', index % 2 === 1 ? 'bg-pan0' : 'bg-pan')}
              style={{ animationDelay: `${Math.min(MAX_ROW_DELAY_MS, index * ROW_DELAY_STEP_MS)}ms` }}
            >
              <span className={cn('w-6 flex-none text-[11px] nums', index === 0 ? 'text-ac' : 'text-tx5')}>{formatPosition(index + 1)}</span>
              <span className="min-w-0 flex-1 truncate text-[12.6px] font-bold tracking-[-.01em] text-tx">{scorer.name}</span>
              <span className="w-10 flex-none text-right text-[10px] text-tx4 nums">{`${scorer.games}J`}</span>
              <span className="h-1 w-[84px] flex-none bg-bd">
                <span className="block h-full" style={{ width: `${barWidthPercent(scorer.goals, topGoals)}%`, background: color }} />
              </span>
              <span className="w-[30px] flex-none text-right text-[15.3px] font-bold text-tx nums">{scorer.goals}</span>
            </Link>
          ))}
        </div>
      )}
    </HistorySection>
  )
}
