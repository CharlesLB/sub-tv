import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import type { HistoryFilter } from '../../history-filter/history-filter'
import { historyHref } from '../../history-href/history-href'
import { barWidthPercent, formatPosition } from '../../stat-format/stat-format'
import type { TeamScorerVM } from '../../types'
import { HistoryEmptyState } from '../history-empty-state/history-empty-state'
import { HistorySection } from '../history-section/history-section'
import { teamScorersStyles as styles } from './team-scorers.styles'

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
        <div className={styles.list}>
          {scorers.map((scorer, index) => (
            <Link
              key={scorer.playerId}
              href={historyHref({ kind: 'athlete', playerId: scorer.playerId }, filter)}
              title="Abrir a ficha do atleta"
              className={cn(styles.row, index % 2 === 1 ? styles.rowOdd : styles.rowEven)}
              style={{ animationDelay: `${Math.min(MAX_ROW_DELAY_MS, index * ROW_DELAY_STEP_MS)}ms` }}
            >
              <span className={cn(styles.position, index === 0 ? styles.positionLeader : styles.positionFollower)}>{formatPosition(index + 1)}</span>
              <span className={styles.name}>{scorer.name}</span>
              <span className={styles.games}>{`${scorer.games}J`}</span>
              <span className={styles.barTrack}>
                <span className={styles.bar} style={{ width: `${barWidthPercent(scorer.goals, topGoals)}%`, background: color }} />
              </span>
              <span className={styles.goals}>{scorer.goals}</span>
            </Link>
          ))}
        </div>
      )}
    </HistorySection>
  )
}
