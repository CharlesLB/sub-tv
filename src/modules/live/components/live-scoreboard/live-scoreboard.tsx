'use client'

import { CategoryTag } from '@/modules/championships/client'
import { MATCH_PERIOD, SIDE } from '@/modules/matches/client'
import { useLiveState } from '../../state/live-context'
import { selectScore } from '../../state/selectors'
import { useLiveCommands } from '../../state/use-live-commands'
import { AddedTimeButton } from '../added-time-button/added-time-button'
import { ConnectionIndicator } from '../connection-indicator/connection-indicator'
import { LiveChrono } from '../live-chrono/live-chrono'
import { LivePill } from '../live-pill/live-pill'
import { ScoreValue } from '../score-value/score-value'
import { ScoreboardTeam } from '../scoreboard-team/scoreboard-team'
import { liveScoreboardStyles as styles } from './live-scoreboard.styles'

export function LiveScoreboard() {
  const { teams, events, clock, category, pulseCount, streamStatus, pendingSyncCounts } = useLiveState()
  const { advanceClock, addMinute } = useLiveCommands()
  const score = selectScore(events)
  const home = teams[SIDE.HOME]
  const away = teams[SIDE.AWAY]
  const canAddMinute = clock.running && clock.period !== MATCH_PERIOD.FULL_TIME

  return (
    <div data-screen-label="Placar" className={styles.bar}>
      {clock.running ? <LivePill /> : null}
      <CategoryTag category={category} className={styles.categoryTag} />
      <div role="group" aria-label={`${home.name} ${score[SIDE.HOME]} × ${score[SIDE.AWAY]} ${away.name}`} className={styles.scoreGroup}>
        <ScoreboardTeam team={home} />
        <div className={styles.scorePanel}>
          <ScoreValue value={score[SIDE.HOME]} pulseCount={pulseCount} />
          <LiveChrono clock={clock} onAdvance={advanceClock} />
          {canAddMinute ? <AddedTimeButton onAdd={addMinute} /> : null}
          <ScoreValue value={score[SIDE.AWAY]} pulseCount={pulseCount} />
        </div>
        <ScoreboardTeam team={away} />
      </div>
      <ConnectionIndicator status={streamStatus} isSaving={Object.keys(pendingSyncCounts).length > 0} />
    </div>
  )
}
