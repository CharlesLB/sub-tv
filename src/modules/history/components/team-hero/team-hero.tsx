import { cn } from '@/lib/utils/cn'
import { pluralize } from '@/lib/utils/pluralize/pluralize'
import { Crest } from '@/components/ui/crest/crest'
import { categoryLabel, categoryTextClass } from '@/modules/championships/client'
import { formatPercent } from '../../lib/stat-format/stat-format'
import type { TeamHistoryVM } from '../../types'
import { teamHeroStyles as styles } from './team-hero.styles'

const HERO_CREST_WIDTH = 45

export function TeamHero({ history }: { history: TeamHistoryVM }) {
  const subtitle = [`${pluralize(history.seasons.length, 'Temporada', 'Temporadas')} No filtro`, `${history.totals.played} Jogos`, `${formatPercent(history.totals.winRate)} de aproveitamento`].join(
    ' · ',
  )

  return (
    <div className={styles.card}>
      {history.team.crestPath ? (
        <span className={styles.crestFrame}>
          <Crest color={history.team.color} imagePath={history.team.crestPath} width={HERO_CREST_WIDTH} />
        </span>
      ) : (
        <span className={styles.badge} style={{ background: history.team.color }}>
          {history.team.abbreviation}
        </span>
      )}
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
