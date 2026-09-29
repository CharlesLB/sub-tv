import { Crest } from '@/components/ui/crest/crest'
import type { LiveTeamVM } from '@/modules/matches/client'
import { scoreboardTeamStyles as styles } from './scoreboard-team.styles'

const SCOREBOARD_CREST_WIDTH = 18

type ScoreboardTeamProps = { team: LiveTeamVM }

export function ScoreboardTeam({ team }: ScoreboardTeamProps) {
  return (
    <div className={styles.team} style={{ background: team.color }} title={team.name}>
      {team.crestPath ? <Crest color={team.color} imagePath={team.crestPath} width={SCOREBOARD_CREST_WIDTH} className={styles.crest} /> : null}
      <span className={styles.abbreviation}>{team.abbreviation}</span>
    </div>
  )
}
