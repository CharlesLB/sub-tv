import { Icon } from '@/components/ui/icon/icon'
import type { AthleteSeasonVM } from '../../types'
import { bestSeasonBannerStyles as styles } from './best-season-banner.styles'

const CHAMPIONSHIP_SEPARATOR = ' · '

export function BestSeasonBanner({ season }: { season: AthleteSeasonVM }) {
  const championships = season.championships.join(CHAMPIONSHIP_SEPARATOR)

  return (
    <div className={styles.banner}>
      <Icon name="star" size={18} className={styles.icon} />
      <span>{`${season.goals} ${season.goals === 1 ? 'Gol' : 'Gols'} em ${season.year} · ${championships}`}</span>
    </div>
  )
}
