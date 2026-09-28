import Link from 'next/link'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { formatChampionships, formatRatio } from '../../stat-format/stat-format'
import type { AthleteSeasonVM } from '../../types'
import { staggeredRowOf } from '../../staggered-row/staggered-row'
import { HistorySection } from '../history-section/history-section'
import { RowChevron } from '../row-chevron/row-chevron'
import { athleteSeasonsTableStyles as styles } from './athlete-seasons-table.styles'

const ROW_DELAY_STEP_MS = 35
const AVERAGE_DIGITS = 2

export function AthleteSeasonsTable({ seasons }: { seasons: AthleteSeasonVM[] }) {
  return (
    <HistorySection title="Temporada por temporada">
      <div className={styles.table}>
        {seasons.map((season, index) => {
          const stagger = staggeredRowOf(index, ROW_DELAY_STEP_MS)

          return (
            <Link key={season.year} href={routes.championships(season.year)} title={`Abrir a temporada ${season.year}`} className={cn(styles.row, stagger.className)} style={stagger.style}>
              <span className={styles.year}>{season.year}</span>
              <span className={styles.championships}>{formatChampionships(season.championships)}</span>
              <span className={styles.games}>{`${season.games}J`}</span>
              <span className={styles.average}>{formatRatio(season.goals, season.games, AVERAGE_DIGITS)}</span>
              <span className={styles.goals}>{season.goals}</span>
              <RowChevron />
            </Link>
          )
        })}
      </div>
    </HistorySection>
  )
}
