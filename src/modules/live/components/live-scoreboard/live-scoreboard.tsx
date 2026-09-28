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

export function LiveScoreboard() {
  const { teams, events, clock, category, pulseCount, streamStatus, pendingSyncCounts } = useLiveState()
  const { advanceClock, addMinute } = useLiveCommands()
  const score = selectScore(events)
  const home = teams[SIDE.HOME]
  const away = teams[SIDE.AWAY]
  const canAddMinute = clock.running && clock.period !== MATCH_PERIOD.FULL_TIME

  return (
    <div data-screen-label="Placar" className="flex flex-none flex-wrap items-center justify-center gap-[14px] border-b border-bd bg-pan px-5 py-3 mobile:gap-2 mobile:px-2 mobile:py-2">
      {clock.running ? <LivePill /> : null}
      <CategoryTag category={category} className="px-[9px] py-[3px] text-[9.9px]" />
      <div role="group" aria-label={`${home.name} ${score[SIDE.HOME]} × ${score[SIDE.AWAY]} ${away.name}`} className="flex -skew-x-12 items-stretch">
        <ScoreboardTeam team={home} />
        <div className="flex items-center gap-4 rounded-card border border-bd2 bg-pan2 px-[22px] py-2 mobile:gap-[10px] mobile:px-3">
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
