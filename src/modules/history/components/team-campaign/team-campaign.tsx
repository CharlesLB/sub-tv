import Link from 'next/link'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import type { TeamSeasonVM } from '../../types'
import { FormSquares } from '../form-squares/form-squares'
import { HistorySection } from '../history-section/history-section'
import { RowChevron } from '../row-chevron/row-chevron'
import { teamCampaignStyles as styles } from './team-campaign.styles'

const ROW_DELAY_STEP_MS = 35
const MAX_ROW_DELAY_MS = 400
const CHAMPIONSHIP_SEPARATOR = ' · '

const recordLine = (season: TeamSeasonVM): string => `${season.wins}V ${season.draws}E ${season.losses}D · ${season.goalsFor}:${season.goalsAgainst}`

export function TeamCampaign({ seasons }: { seasons: TeamSeasonVM[] }) {
  return (
    <HistorySection title="Campanha por temporada">
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
            <FormSquares form={season.form} />
            <span className={styles.record}>{recordLine(season)}</span>
            <span className={styles.points}>{`${season.points} PTS`}</span>
            <RowChevron />
          </Link>
        ))}
      </div>
    </HistorySection>
  )
}
