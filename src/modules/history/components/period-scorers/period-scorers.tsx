import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { categoryLabel } from '@/modules/championships/client'
import type { HistoryFilter } from '../../history-filter/history-filter'
import { historyHref } from '../../history-href/history-href'
import { barWidthPercent, formatPosition } from '../../stat-format/stat-format'
import type { PeriodScorerVM } from '../../types'
import { HistoryEmptyState } from '../history-empty-state/history-empty-state'
import { HistorySection } from '../history-section/history-section'
import { RowChevron } from '../row-chevron/row-chevron'
import { periodScorersStyles as styles } from './period-scorers.styles'

const ROW_DELAY_STEP_MS = 40
const MAX_ROW_DELAY_MS = 400

const seasonCountLabel = (seasonCount: number): string => `${seasonCount} ${seasonCount === 1 ? 'Temp.' : 'Temps.'}`

type PeriodScorersProps = { scorers: PeriodScorerVM[]; filter: HistoryFilter }

export function PeriodScorers({ scorers, filter }: PeriodScorersProps) {
  const topGoals = scorers[0]?.goals ?? 1

  return (
    <HistorySection title="Artilheiros do período" className={styles.section}>
      {scorers.length === 0 ? (
        <HistoryEmptyState message="Nenhum gol registrado para os filtros selecionados" />
      ) : (
        <div className={styles.list}>
          {scorers.map((scorer, index) => (
            <Link
              key={`${scorer.playerId}-${scorer.category}`}
              href={historyHref({ kind: 'athlete', playerId: scorer.playerId }, filter)}
              title="Abrir a ficha do atleta"
              className={cn(styles.row, index % 2 === 1 ? styles.rowOdd : styles.rowEven)}
              style={{ animationDelay: `${Math.min(MAX_ROW_DELAY_MS, index * ROW_DELAY_STEP_MS)}ms` }}
            >
              <span className={cn(styles.position, index === 0 ? styles.positionLeader : styles.positionFollower)}>{formatPosition(index + 1)}</span>
              <span className={styles.colorSwatch} style={{ background: scorer.team.color }} />
              <span className={styles.identity}>
                <span className={styles.name}>{scorer.name}</span>
                <span className={styles.team}>{`${scorer.team.name} · ${categoryLabel[scorer.category]}`}</span>
              </span>
              <span className={styles.barTrack}>
                <span className={styles.bar} style={{ width: `${barWidthPercent(scorer.goals, topGoals)}%`, background: scorer.team.color }} />
              </span>
              <span className={styles.goals}>{scorer.goals}</span>
              <span className={styles.seasonCount}>{seasonCountLabel(scorer.seasonCount)}</span>
              <RowChevron />
            </Link>
          ))}
        </div>
      )}
    </HistorySection>
  )
}
