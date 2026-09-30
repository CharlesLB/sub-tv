import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { pluralize } from '@/lib/utils/pluralize/pluralize'
import { Crest } from '@/components/ui/crest/crest'
import { categoryLabel } from '@/modules/championships/client'
import type { HistoryFilter } from '../../lib/history-filter/history-filter'
import { historyHref } from '../../lib/history-href/history-href'
import { staggeredRowOf } from '../../lib/staggered-row/staggered-row'
import { barWidthPercent, formatPosition, mostGoals } from '../../lib/stat-format/stat-format'
import type { PeriodScorerVM } from '../../types'
import { HistoryEmptyState } from '../history-empty-state/history-empty-state'
import { HistorySection } from '../history-section/history-section'
import { RowChevron } from '../row-chevron/row-chevron'
import { periodScorersStyles as styles } from './period-scorers.styles'

const ROW_DELAY_STEP_MS = 40
const ROW_CREST_WIDTH = 18

type PeriodScorersProps = { scorers: PeriodScorerVM[]; filter: HistoryFilter }

export function PeriodScorers({ scorers, filter }: PeriodScorersProps) {
  const topGoals = mostGoals(scorers)

  return (
    <HistorySection title="Artilheiros do período" className={styles.section}>
      {scorers.length === 0 ? (
        <HistoryEmptyState message="Nenhum gol registrado para os filtros selecionados" />
      ) : (
        <div className={styles.list}>
          {scorers.map((scorer, index) => {
            const stagger = staggeredRowOf(index, ROW_DELAY_STEP_MS)

            return (
              <Link
                key={`${scorer.playerId}-${scorer.category}`}
                href={historyHref({ kind: 'athlete', playerId: scorer.playerId }, filter)}
                title="Abrir a ficha do atleta"
                className={cn(styles.row, stagger.className)}
                style={stagger.style}
              >
                <span className={cn(styles.position, index === 0 ? styles.positionLeader : styles.positionFollower)}>{formatPosition(index + 1)}</span>
                <Crest color={scorer.team.color} imagePath={scorer.team.crestPath} width={ROW_CREST_WIDTH} />
                <span className={styles.identity}>
                  <span className={styles.name}>{scorer.name}</span>
                  <span className={styles.team}>{`${scorer.team.name} · ${categoryLabel[scorer.category]}`}</span>
                </span>
                <span className={styles.barTrack}>
                  <span className={styles.bar} style={{ width: `${barWidthPercent(scorer.goals, topGoals)}%`, background: scorer.team.color }} />
                </span>
                <span className={styles.goals}>{scorer.goals}</span>
                <span className={styles.seasonCount}>{pluralize(scorer.seasonCount, 'Temp.', 'Temps.')}</span>
                <RowChevron />
              </Link>
            )
          })}
        </div>
      )}
    </HistorySection>
  )
}
