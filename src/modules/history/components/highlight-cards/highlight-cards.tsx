import Link from 'next/link'
import { categoryLabel } from '@/modules/championships/client'
import type { HistoryFilter } from '../../history-filter/history-filter'
import { historyHref, type HistoryTarget } from '../../history-href/history-href'
import { formatPercent } from '../../stat-format/stat-format'
import type { AccumulatedTeamRowVM, HistoryOverviewVM } from '../../types'

const HIGHLIGHT_DELAY_STEP_MS = 55

type Highlight = { label: string; value: string; name: string; target: HistoryTarget }

const teamName = (row: AccumulatedTeamRowVM): string => `${row.team.name} ${categoryLabel[row.category]}`

const buildHighlights = (overview: HistoryOverviewVM): Highlight[] => {
  const [topScorer] = overview.scorers

  return [
    ...(overview.bestWinRate
      ? [{ label: 'Melhor aproveitamento', value: formatPercent(overview.bestWinRate.winRate), name: teamName(overview.bestWinRate), target: { kind: 'team', teamKey: overview.bestWinRate.teamKey } as const }]
      : []),
    ...(topScorer
      ? [{ label: 'Maior artilheiro', value: String(topScorer.goals), name: `${topScorer.name} · ${topScorer.team.name}`, target: { kind: 'athlete', playerId: topScorer.playerId } as const }]
      : []),
    ...(overview.mostGames
      ? [{ label: 'Mais jogos', value: String(overview.mostGames.played), name: teamName(overview.mostGames), target: { kind: 'team', teamKey: overview.mostGames.teamKey } as const }]
      : []),
  ]
}

type HighlightCardsProps = { overview: HistoryOverviewVM; filter: HistoryFilter }

export function HighlightCards({ overview, filter }: HighlightCardsProps) {
  const highlights = buildHighlights(overview)
  if (highlights.length === 0) return null

  return (
    <div className="mt-[22px] grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-[10px]">
      {highlights.map((highlight, index) => (
        <Link
          key={highlight.label}
          href={historyHref(highlight.target, filter)}
          className="flex min-w-0 animate-fade-up flex-col items-start gap-[6px] rounded-card border border-bd bg-pan px-4 py-[14px] text-left transition-[border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-bd3"
          style={{ animationDelay: `${index * HIGHLIGHT_DELAY_STEP_MS}ms` }}
        >
          <span className="text-[9.5px] tracking-[.05em] text-tx5">{highlight.label}</span>
          <span className="text-[27.9px] leading-none font-bold text-tx nums">{highlight.value}</span>
          <span className="max-w-full truncate text-[12.2px] font-bold tracking-[-.01em] text-tx2">{highlight.name}</span>
        </Link>
      ))}
    </div>
  )
}
