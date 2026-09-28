import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { categoryLabel, categoryTextClass } from '@/modules/championships/client'
import type { HistoryFilter } from '../../history-filter/history-filter'
import { historyHref } from '../../history-href/history-href'
import { staggeredRowOf } from '../../staggered-row/staggered-row'
import { formatPercent, formatPosition, formatSignedNumber } from '../../stat-format/stat-format'
import type { AccumulatedTeamRowVM } from '../../types'
import { HistoryEmptyState } from '../history-empty-state/history-empty-state'
import { HistorySection } from '../history-section/history-section'
import { RowChevron } from '../row-chevron/row-chevron'
import { accumulatedTableStyles as styles } from './accumulated-table.styles'

const ROW_DELAY_STEP_MS = 30

type AccumulatedTableProps = { rows: AccumulatedTeamRowVM[]; filter: HistoryFilter }

export function AccumulatedTable({ rows, filter }: AccumulatedTableProps) {
  return (
    <HistorySection title="Classificação acumulada por time" className={styles.section}>
      {rows.length === 0 ? (
        <HistoryEmptyState message="Nenhuma campanha registrada para os filtros selecionados" />
      ) : (
        <div className={styles.table}>
          <div className={styles.header}>
            <span className={styles.headerPosition}>#</span>
            <span className={styles.headerColorSwatch} />
            <span className={styles.headerTeam}>Time</span>
            <span className={styles.headerCategory}>Cat</span>
            <span className={cn(styles.headerNumber, styles.playedColumn)}>J</span>
            <span className={cn(styles.headerNumber, styles.resultColumn)}>V</span>
            <span className={cn(styles.headerNumber, styles.resultColumn)}>E</span>
            <span className={cn(styles.headerNumber, styles.resultColumn)}>D</span>
            <span className={cn(styles.headerNumber, styles.goalDifferenceColumn)}>SG</span>
            <span className={cn(styles.headerNumber, styles.pointsColumn)}>PTS</span>
            <span className={cn(styles.headerNumber, styles.winRateColumn)}>APR</span>
            <span className={styles.headerChevron} />
          </div>
          {rows.map((row, index) => {
            const stagger = staggeredRowOf(index, ROW_DELAY_STEP_MS)

            return (
              <Link
                key={row.teamKey}
                href={historyHref({ kind: 'team', teamKey: row.teamKey }, filter)}
                title="Abrir a página do time"
                className={cn(styles.row, stagger.className, index === 0 ? styles.rowLeader : styles.rowFollower)}
                style={stagger.style}
              >
                <span className={cn(styles.position, index === 0 ? styles.positionLeader : styles.positionFollower)}>{formatPosition(index + 1)}</span>
                <span className={styles.colorSwatch} style={{ background: row.team.color }} />
                <span className={styles.teamName}>{row.team.name}</span>
                <span className={cn(styles.category, categoryTextClass[row.category])}>{categoryLabel[row.category]}</span>
                <span className={cn(styles.numberCell, styles.playedColumn)}>{row.played}</span>
                <span className={cn(styles.numberCell, styles.resultColumn)}>{row.wins}</span>
                <span className={cn(styles.numberCell, styles.resultColumn)}>{row.draws}</span>
                <span className={cn(styles.numberCell, styles.resultColumn)}>{row.losses}</span>
                <span className={cn(styles.numberCell, styles.goalDifferenceColumn)}>{formatSignedNumber(row.goalDifference)}</span>
                <span className={cn(styles.numberCell, styles.pointsCell)}>{row.points}</span>
                <span className={cn(styles.numberCell, styles.winRateCell)}>{formatPercent(row.winRate)}</span>
                <RowChevron />
              </Link>
            )
          })}
        </div>
      )}
    </HistorySection>
  )
}
