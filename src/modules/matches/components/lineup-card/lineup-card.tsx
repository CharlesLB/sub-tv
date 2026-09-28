import { cn } from '@/lib/utils/cn'
import { Crest } from '@/components/ui/crest/crest'
import { type Category, CategoryTag } from '@/modules/championships/client'
import { STARTERS_PER_TEAM } from '../../default-starters/default-starters'
import type { SetupTeamVM } from '../../types'
import { lineupCardStyles as styles } from './lineup-card.styles'

type LineupCardProps = {
  team: SetupTeamVM
  category: Category
  sourceLine: string
  starterIds: string[]
  onToggle: (playerId: string) => void
}

const nicknameSuffix = (name: string, nickname: string | null): string => (nickname && nickname !== name ? ` "${nickname}"` : '')

export function LineupCard({ team, category, sourceLine, starterIds, onToggle }: LineupCardProps) {
  const starterSet = new Set(starterIds)
  const isComplete = starterIds.length === STARTERS_PER_TEAM

  return (
    <section aria-label={`Escalação ${team.name}`} className={styles.card}>
      <div className={styles.header}>
        <Crest color={team.color} imagePath={team.crestPath} width={22} />
        <span className={styles.teamName}>{team.name}</span>
        <CategoryTag category={category} size="medium" />
        <span className={cn(styles.starterCount, isComplete ? styles.starterCountComplete : styles.starterCountIncomplete)}>
          {starterIds.length}/{STARTERS_PER_TEAM} titulares
        </span>
      </div>
      <div className={styles.sourceLine}>{sourceLine}</div>
      <div className={styles.playerList}>
        {team.players.length === 0 ? <p className={styles.emptyMessage}>Nenhum atleta vinculado a este time na temporada.</p> : null}
        {team.players.map((player) => {
          const isStarter = starterSet.has(player.playerId)
          const isLocked = !isStarter && isComplete

          return (
            <button
              key={player.playerId}
              type="button"
              role="checkbox"
              aria-checked={isStarter}
              aria-disabled={isLocked}
              onClick={() => onToggle(player.playerId)}
              className={cn(styles.player, isStarter ? styles.playerStarter : styles.playerReserve, isLocked ? styles.playerLocked : styles.playerAvailable)}
            >
              <span aria-hidden className={cn(styles.checkbox, !isStarter && styles.checkboxUnchecked)} style={isStarter ? { borderColor: team.color, background: team.color } : undefined} />
              <span className={cn(styles.shirtNumber, !isStarter && styles.shirtNumberReserve)} style={isStarter ? { color: team.color } : undefined}>
                {player.shirtNumber}
              </span>
              <span className={styles.playerName}>
                {player.name}
                {nicknameSuffix(player.name, player.nickname)}
              </span>
              {player.position ? <span className={styles.position}>{player.position}</span> : null}
            </button>
          )
        })}
      </div>
    </section>
  )
}
