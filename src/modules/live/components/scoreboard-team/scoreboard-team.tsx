import type { LiveTeamVM } from '@/modules/matches/client'
import { scoreboardTeamStyles as styles } from './scoreboard-team.styles'

type ScoreboardTeamProps = { team: LiveTeamVM }

export function ScoreboardTeam({ team }: ScoreboardTeamProps) {
  return (
    <div className={styles.team} style={{ background: team.color }} title={team.name}>
      <span className={styles.abbreviation}>{team.abbreviation}</span>
    </div>
  )
}
