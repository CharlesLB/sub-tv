import Link from 'next/link'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { FORM_SQUARE_SIZE, FormSquares } from '@/modules/championships/client'
import { staggeredRowOf } from '../../staggered-row/staggered-row'
import { formatChampionships } from '../../stat-format/stat-format'
import type { TeamSeasonVM } from '../../types'
import { HistorySection } from '../history-section/history-section'
import { RowChevron } from '../row-chevron/row-chevron'
import { teamCampaignStyles as styles } from './team-campaign.styles'

const ROW_DELAY_STEP_MS = 35

const recordLine = (season: TeamSeasonVM): string => `${season.wins}V ${season.draws}E ${season.losses}D · ${season.goalsFor}:${season.goalsAgainst}`

export function TeamCampaign({ seasons }: { seasons: TeamSeasonVM[] }) {
  return (
    <HistorySection title="Campanha por temporada">
      <div className={styles.table}>
        {seasons.map((season, index) => {
          const stagger = staggeredRowOf(index, ROW_DELAY_STEP_MS)

          return (
            <Link key={season.year} href={routes.championships(season.year)} title={`Abrir a temporada ${season.year}`} className={cn(styles.row, stagger.className)} style={stagger.style}>
              <span className={styles.year}>{season.year}</span>
              <span className={styles.championships}>{formatChampionships(season.championships)}</span>
              <FormSquares form={season.form} size={FORM_SQUARE_SIZE.DENSE} />
              <span className={styles.record}>{recordLine(season)}</span>
              <span className={styles.points}>{`${season.points} PTS`}</span>
              <RowChevron />
            </Link>
          )
        })}
      </div>
    </HistorySection>
  )
}
