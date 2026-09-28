import { cn } from '@/lib/utils/cn'
import { pluralize } from '@/lib/utils/pluralize/pluralize'
import { categoryLabel, categoryTextClass } from '@/modules/championships/client'
import type { AthleteHistoryVM } from '../../types'
import { athleteHeroStyles as styles } from './athlete-hero.styles'

const MISSING_VALUE = '–'

export function AthleteHero({ history }: { history: AthleteHistoryVM }) {
  const teamColor = history.team?.color
  const teamLine = history.team && history.category ? `${history.team.name} · ${categoryLabel[history.category]}` : null
  const subtitle = `${pluralize(history.seasons.length, 'Temporada', 'Temporadas')} No filtro · ${history.games} Jogos`

  return (
    <div className={styles.card}>
      <span className={cn(styles.shirtNumber, teamColor ? null : styles.shirtNumberFallback)} style={teamColor ? { borderColor: teamColor, color: teamColor } : undefined}>
        {history.shirtNumber ?? MISSING_VALUE}
      </span>
      <div className={styles.details}>
        <div className={styles.line}>
          <span className={styles.name}>{history.name}</span>
          {history.nickname ? <span className={styles.nickname}>{`“${history.nickname}”`}</span> : null}
        </div>
        {history.position || teamLine ? (
          <div className={styles.line}>
            {history.position ? <span className={cn(styles.position, history.category ? categoryTextClass[history.category] : styles.positionFallback)}>{history.position}</span> : null}
            {teamLine ? <span className={styles.teamLine}>{teamLine}</span> : null}
          </div>
        ) : null}
        <span className={styles.subtitle}>{subtitle}</span>
      </div>
    </div>
  )
}
