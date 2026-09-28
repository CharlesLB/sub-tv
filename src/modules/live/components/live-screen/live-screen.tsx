'use client'

import { useState } from 'react'
import { useMediaQuery } from '@/lib/hooks/use-media-query/use-media-query'
import { SIDE } from '@/modules/matches/client'
import { useLiveShortcuts } from '../../hooks/use-live-shortcuts'
import { useBoardInteractions } from '../../interaction/use-board-interactions'
import { useLiveState } from '../../state/live-context'
import { buildTimeline } from '../../state/timeline'
import { BoardArea } from '../board-area/board-area'
import { EventsStrip } from '../events-strip/events-strip'
import { ExpandedTimeline } from '../expanded-timeline/expanded-timeline'
import { LiveOverlays } from '../live-overlays/live-overlays'
import { LiveScoreboard } from '../live-scoreboard/live-scoreboard'
import { OfficialsStrip } from '../officials-strip/officials-strip'
import type { OfficialsStripItem } from '../officials-strip/officials-strip-items'

const COMPACT_QUERY = '(max-width: 619px), (max-height: 479px) and (max-width: 999px)'
const PORTRAIT_PHONE_QUERY = '(max-width: 619px) and (orientation: portrait)'

type LiveScreenProps = { officialsItems: OfficialsStripItem[] }

export function LiveScreen({ officialsItems }: LiveScreenProps) {
  const { events, clock, playersById, players, positions, teams, isSyncFailing } = useLiveState()
  const interactions = useBoardInteractions()
  const isCompact = useMediaQuery(COMPACT_QUERY)
  const isPortraitPhone = useMediaQuery(PORTRAIT_PHONE_QUERY)
  const [isTimelineExpanded, setTimelineExpanded] = useState(false)
  const timeline = buildTimeline(events, clock, playersById)

  const placedPlayers = players.flatMap((player) => {
    const point = positions[player.playerId]

    return interactions.playerStates[player.playerId]?.onPitch && point ? [{ playerId: player.playerId, ...point }] : []
  })

  useLiveShortcuts({ placedPlayers, onEscape: interactions.clearTransient })
  const showsTimeline = isTimelineExpanded || isPortraitPhone

  return (
    <div data-screen-label="Ao vivo" className="relative flex min-h-0 flex-1 animate-fade-in flex-col overflow-hidden bg-bg">
      {isSyncFailing ? <div role="status" aria-label="Falha ao salvar lances; reenviando" className="absolute inset-x-0 top-0 z-10 h-[2px] bg-vm" /> : null}
      <LiveScoreboard />
      <OfficialsStrip items={officialsItems} />
      <EventsStrip
        items={timeline}
        teamColors={{ [SIDE.HOME]: teams[SIDE.HOME].color, [SIDE.AWAY]: teams[SIDE.AWAY].color }}
        isExpanded={isTimelineExpanded}
        canExpand={!isPortraitPhone}
        onToggleExpanded={() => setTimelineExpanded((current) => !current)}
      />
      {showsTimeline ? <ExpandedTimeline items={timeline} teams={teams} showRotateNotice={isPortraitPhone} /> : <BoardArea interactions={interactions} isCompact={isCompact} />}
      <LiveOverlays interactions={interactions} />
    </div>
  )
}
