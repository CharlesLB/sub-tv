import Link from 'next/link'
import * as R from 'remeda'
import { Crest } from '@/components/ui/crest/crest'
import { categoryLabel, type TeamBadgeVM } from '@/modules/championships/client'
import type { HistoryFilter } from '../../history-filter/history-filter'
import { type HistoryTarget, historyHref } from '../../history-href/history-href'
import { formatPercent } from '../../stat-format/stat-format'
import type { AccumulatedTeamRowVM, HistoryOverviewVM } from '../../types'
import { highlightCardsStyles as styles } from './highlight-cards.styles'

const HIGHLIGHT_DELAY_STEP_MS = 55
const HIGHLIGHT_CREST_WIDTH = 16

type Highlight = { label: string; value: string; name: string; team: TeamBadgeVM; target: HistoryTarget }

const teamName = (row: AccumulatedTeamRowVM): string => `${row.team.name} ${categoryLabel[row.category]}`

const buildHighlights = (overview: HistoryOverviewVM): Highlight[] => {
  const topScorer = R.firstBy(overview.scorers, [(scorer) => scorer.goals, 'desc'])

  return [
    ...(overview.bestWinRate
      ? [
          {
            label: 'Melhor aproveitamento',
            value: formatPercent(overview.bestWinRate.winRate),
            name: teamName(overview.bestWinRate),
            team: overview.bestWinRate.team,
            target: { kind: 'team', teamKey: overview.bestWinRate.teamKey } as const,
          },
        ]
      : []),
    ...(topScorer
      ? [
          {
            label: 'Maior artilheiro',
            value: String(topScorer.goals),
            name: `${topScorer.name} · ${topScorer.team.name}`,
            team: topScorer.team,
            target: { kind: 'athlete', playerId: topScorer.playerId } as const,
          },
        ]
      : []),
    ...(overview.mostGames
      ? [
          {
            label: 'Mais jogos',
            value: String(overview.mostGames.played),
            name: teamName(overview.mostGames),
            team: overview.mostGames.team,
            target: { kind: 'team', teamKey: overview.mostGames.teamKey } as const,
          },
        ]
      : []),
  ]
}

type HighlightCardsProps = { overview: HistoryOverviewVM; filter: HistoryFilter }

export function HighlightCards({ overview, filter }: HighlightCardsProps) {
  const highlights = buildHighlights(overview)
  if (highlights.length === 0) return null

  return (
    <div className={styles.grid}>
      {highlights.map((highlight, index) => (
        <Link key={highlight.label} href={historyHref(highlight.target, filter)} className={styles.card} style={{ animationDelay: `${index * HIGHLIGHT_DELAY_STEP_MS}ms` }}>
          <span className={styles.label}>{highlight.label}</span>
          <span className={styles.value}>{highlight.value}</span>
          <span className={styles.identity}>
            <Crest color={highlight.team.color} imagePath={highlight.team.crestPath} width={HIGHLIGHT_CREST_WIDTH} />
            <span className={styles.name}>{highlight.name}</span>
          </span>
        </Link>
      ))}
    </div>
  )
}
