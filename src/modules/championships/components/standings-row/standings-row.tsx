import { cn } from '@/lib/utils/cn'
import { Crest } from '@/components/ui/crest/crest'
import type { Category } from '../../categories'
import type { StandingRowVM } from '../../types'
import { CategoryTag } from '../category-tag/category-tag'
import { FormSquares } from '../form-squares/form-squares'
import { standingsRowStyles as styles } from './standings-row.styles'

const ROW_DELAY_STEP_MS = 28
const TOP_POSITIONS = 4
const BOTTOM_POSITIONS = 2

const formatGoalDifference = (goalDifference: number): string => (goalDifference > 0 ? `+${goalDifference}` : String(goalDifference))

const positionClass = (position: number, groupSize: number): string => {
  if (position <= TOP_POSITIONS) return styles.positionTop
  if (position > groupSize - BOTTOM_POSITIONS) return styles.positionBottom

  return styles.positionMiddle
}

const goalDifferenceClass = (goalDifference: number): string => {
  if (goalDifference > 0) return styles.goalDifferencePositive
  if (goalDifference < 0) return styles.goalDifferenceNegative

  return styles.goalDifferenceEven
}

type StandingsRowProps = { row: StandingRowVM; index: number; groupSize: number; category: Category }

export function StandingsRow({ row, index, groupSize, category }: StandingsRowProps) {
  return (
    <details className={styles.row} style={{ animationDelay: `${index * ROW_DELAY_STEP_MS}ms` }}>
      <summary className={cn(styles.grid, styles.summary)}>
        <span className={cn(styles.position, positionClass(row.position, groupSize))}>{row.position}</span>
        <span className={styles.club}>
          <span className={styles.chevron}>›</span>
          <Crest color={row.team.color} imagePath={row.team.crestPath} width={18} />
          <span className={styles.clubName}>{row.team.name}</span>
        </span>
        <span className={styles.points}>{row.points}</span>
        <span className={styles.numberCell}>{row.played}</span>
        <span className={cn(styles.numberCell, styles.wideOnly)}>{row.wins}</span>
        <span className={cn(styles.numberCell, styles.wideOnly)}>{row.draws}</span>
        <span className={cn(styles.numberCell, styles.wideOnly)}>{row.losses}</span>
        <span className={cn(styles.goalDifference, goalDifferenceClass(row.goalDifference))}>{formatGoalDifference(row.goalDifference)}</span>
        <FormSquares form={row.form} className={styles.wideOnly} />
      </summary>
      <div className={styles.squadPanel}>
        <div className={styles.squadHeader}>
          <span className={styles.squadTitle}>Elenco</span>
          <CategoryTag category={category} />
          <span className={styles.squadCount}>{row.squad.length} atletas na súmula</span>
        </div>
        <div className={styles.squadGrid}>
          {row.squad.map((player) => (
            <div key={player.playerId} className={styles.player}>
              <span className={styles.shirtNumber} style={{ color: row.team.color }}>
                {player.shirtNumber ?? '–'}
              </span>
              <span className={styles.playerName}>{player.name}</span>
              {player.position ? <span className={styles.playerPosition}>{player.position}</span> : null}
            </div>
          ))}
        </div>
      </div>
    </details>
  )
}
