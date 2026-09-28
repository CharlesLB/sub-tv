import Link from 'next/link'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { formatRatio } from '../../stat-format/stat-format'
import type { AthleteSeasonVM } from '../../types'
import { HistorySection } from '../history-section/history-section'
import { RowChevron } from '../row-chevron/row-chevron'
import { athleteSeasonsTableStyles as styles } from './athlete-seasons-table.styles'

const ROW_DELAY_STEP_MS = 35
const MAX_ROW_DELAY_MS = 400
const AVERAGE_DIGITS = 2
const CHAMPIONSHIP_SEPARATOR = ' · '

export function AthleteSeasonsTable({ seasons }: { seasons: AthleteSeasonVM[] }) {
  return (
    <HistorySection title="Temporada por temporada">
      <div className={styles.table}>
        {seasons.map((season, index) => (
          <Link
            key={season.year}
            href={routes.championships(season.year)}
            title={`Abrir a temporada ${season.year}`}
            className={cn(styles.row, index % 2 === 1 ? styles.rowOdd : styles.rowEven)}
            style={{ animationDelay: `${Math.min(MAX_ROW_DELAY_MS, index * ROW_DELAY_STEP_MS)}ms` }}
          >
            <span className={styles.year}>{season.year}</span>
            <span className={styles.championships}>{season.championships.join(CHAMPIONSHIP_SEPARATOR)}</span>
            <span className={styles.games}>{`${season.games}J`}</span>
            <span className={styles.average}>{formatRatio(season.goals, season.games, AVERAGE_DIGITS)}</span>
            <span className={styles.goals}>{season.goals}</span>
            <RowChevron />
          </Link>
        ))}
      </div>
    </HistorySection>
  )
}
