import { Crest } from '@/components/ui/crest/crest'
import { type Category, CategoryTag, categoryLabel } from '@/modules/championships/client'
import { MATCH_DURATION_LABEL } from '../../wizard-selectors/wizard-selectors'
import type { LineupSideVM } from '../lineups-step/lineups-step'
import { reviewStepStyles as styles } from './review-step.styles'

type ReviewStepProps = {
  championshipName: string
  category: Category
  subtitle: string
  sides: LineupSideVM[]
}

export function ReviewStep({ championshipName, category, subtitle, sides }: ReviewStepProps) {
  const title = sides.map(({ team }) => team.name).join('  ×  ')

  const broadcastFacts = [
    { label: 'Campeonato', value: `${championshipName} · ${categoryLabel[category]}` },
    { label: 'Tempo de jogo', value: MATCH_DURATION_LABEL },
  ]

  return (
    <div className={styles.step}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <div className={styles.championshipLine}>
            <CategoryTag category={category} size="extraLarge" />
            <span className={styles.championshipName}>{championshipName}</span>
          </div>
          <div className={styles.title}>{title}</div>
          <div className={styles.subtitle}>{subtitle}</div>
        </div>
        <div className={styles.readyBadge}>
          <span className={styles.readyBadgeText}>Pronta para transmitir</span>
        </div>
      </div>
      <div className={styles.lineups}>
        {sides.map(({ side, team, starterIds }) => {
          const starterSet = new Set(starterIds)

          return (
            <div key={side} className={styles.lineup}>
              <div className={styles.lineupHeader}>
                <Crest color={team.color} imagePath={team.crestPath} width={18} />
                <span className={styles.teamName}>{team.name}</span>
                <CategoryTag category={category} size="medium" />
              </div>
              <div className={styles.starters}>
                {team.players
                  .filter((player) => starterSet.has(player.playerId))
                  .map((player) => (
                    <div key={player.playerId} className={styles.starter}>
                      <span className={styles.starterShirtNumber} style={{ color: team.color }}>
                        {player.shirtNumber}
                      </span>
                      <span className={styles.starterName}>{player.name}</span>
                    </div>
                  ))}
              </div>
            </div>
          )
        })}
      </div>
      <div className={styles.broadcast}>
        <div className={styles.broadcastTitle}>Transmissão</div>
        {broadcastFacts.map((fact) => (
          <div key={fact.label} className={styles.fact}>
            <span className={styles.factLabel}>{fact.label}</span>
            <span className={styles.factValue}>{fact.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
