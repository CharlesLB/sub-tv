import { cn } from '@/lib/utils/cn'
import { Crest } from '@/components/ui/crest/crest'
import type { Category } from '../../categories'
import type { TopScorerVM } from '../../types'
import { CategoryTag } from '../category-tag/category-tag'

const ROW_DELAY_STEP_MS = 28
const GRID_CLASS = 'grid grid-cols-[34px_minmax(0,1.3fr)_minmax(0,1fr)_52px_52px] gap-x-2 px-4 compact:grid-cols-[26px_minmax(0,1fr)_38px_38px] compact:gap-x-[6px] compact:px-[11px]'

const HEADERS = [
  { label: '#', className: 'text-left' },
  { label: 'Atleta', className: 'text-left' },
  { label: 'Time', className: 'text-left compact:hidden' },
  { label: 'G', className: 'text-center' },
  { label: 'J', className: 'text-center' },
] as const

type TopScorersTableProps = { scorers: TopScorerVM[]; category: Category }

export function TopScorersTable({ scorers, category }: TopScorersTableProps) {
  return (
    <section className="max-w-[1000px] animate-fade-up">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span className="text-[13.5px] font-bold tracking-[-.01em]">Artilharia</span>
        <CategoryTag category={category} size="extraLarge" />
        <span className="text-[12.5px] text-tx4">Gols contam apenas nesta categoria.</span>
      </div>
      <div className="overflow-hidden rounded-card border border-bd bg-pan">
        <div className={cn(GRID_CLASS, 'border-b border-bd py-[10px] compact:py-[9px]')}>
          {HEADERS.map((header) => (
            <span key={header.label} className={cn('text-[10.5px] font-semibold tracking-[.14em] whitespace-nowrap text-tx4 compact:text-[9px]', header.className)}>
              {header.label}
            </span>
          ))}
        </div>
        {scorers.map((scorer, index) => (
          <div
            key={`${scorer.playerId}-${scorer.seasonTeamId}`}
            className={cn(GRID_CLASS, 'animate-rise-in items-center border-b border-bd py-[11px] compact:py-[10px]')}
            style={{ animationDelay: `${index * ROW_DELAY_STEP_MS}ms` }}
          >
            <span className={cn('font-mono text-[12px] nums', index === 0 ? 'text-ac' : 'text-tx4')}>{String(index + 1).padStart(2, '0')}</span>
            <div className="flex min-w-0 items-baseline gap-[9px]">
              <span className="min-w-[18px] text-[12.6px] font-bold nums" style={{ color: scorer.team.color }}>
                {scorer.shirtNumber ?? '–'}
              </span>
              <span className="truncate text-[14px] whitespace-nowrap">
                {scorer.name}
                {scorer.nickname ? ` "${scorer.nickname}"` : ''}
              </span>
              {scorer.position ? <span className="text-[9px] font-semibold tracking-[-.01em] whitespace-nowrap text-tx4 uppercase">{scorer.position}</span> : null}
            </div>
            <div className="flex min-w-0 items-center gap-[9px] compact:hidden">
              <Crest color={scorer.team.color} imagePath={scorer.team.crestPath} width={18} />
              <span className="truncate text-[11.7px] font-bold tracking-[-.01em] whitespace-nowrap text-tx2">{scorer.team.name}</span>
            </div>
            <span className="text-center text-[17px] font-extrabold text-ac nums">{scorer.goals}</span>
            <span className="text-center text-[14px] font-semibold text-tx2 nums">{scorer.games}</span>
          </div>
        ))}
        {scorers.length === 0 ? <div className="px-4 py-6 text-center text-[12.5px] text-tx4">Nenhum gol registrado nas súmulas deste campeonato.</div> : null}
      </div>
      <p className="mt-3 text-[12px] text-tx4">G gols · J jogos · em caso de empate, quem fez os gols em menos jogos aparece na frente.</p>
    </section>
  )
}
