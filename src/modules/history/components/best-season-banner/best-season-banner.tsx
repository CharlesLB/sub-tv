import { pluralize } from '@/lib/utils/pluralize/pluralize'
import { Icon } from '@/components/ui/icon/icon'
import { formatChampionships } from '../../stat-format/stat-format'
import type { AthleteSeasonVM } from '../../types'
import { bestSeasonBannerStyles as styles } from './best-season-banner.styles'

export function BestSeasonBanner({ season }: { season: AthleteSeasonVM }) {
  const championships = formatChampionships(season.championships)

  return (
    <div className={styles.banner}>
      <Icon name="star" size={18} className={styles.icon} />
      <span>{`${pluralize(season.goals, 'Gol', 'Gols')} em ${season.year} · ${championships}`}</span>
    </div>
  )
}
