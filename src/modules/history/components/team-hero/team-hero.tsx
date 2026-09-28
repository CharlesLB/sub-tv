import { cn } from '@/lib/utils/cn'
import { pluralize } from '@/lib/utils/pluralize/pluralize'
import { categoryLabel, categoryTextClass } from '@/modules/championships/client'
import { formatPercent } from '../../stat-format/stat-format'
import type { TeamHistoryVM } from '../../types'
import { teamHeroStyles as styles } from './team-hero.styles'

export function TeamHero({ history }: { history: TeamHistoryVM }) {
  const subtitle = [`${pluralize(history.seasons.length, 'Temporada', 'Temporadas')} No filtro`, `${history.totals.played} Jogos`, `${formatPercent(history.totals.winRate)} de aproveitamento`].join(
    ' · ',
  )

  return (
    <div className={styles.card}>
      <span className={styles.badge} style={{ background: history.team.color }}>
        {history.team.abbreviation}
      </span>
      <div className={styles.details}>
        <div className={styles.line}>
          <span className={styles.name}>{history.team.name}</span>
          <span className={cn(styles.category, categoryTextClass[history.category])}>{categoryLabel[history.category]}</span>
        </div>
        <span className={styles.subtitle}>{subtitle}</span>
      </div>
    </div>
  )
}
