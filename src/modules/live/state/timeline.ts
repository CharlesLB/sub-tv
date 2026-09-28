import { GOAL_TYPE, LIVE_EVENT_TYPE, MATCH_PERIOD, type LiveClock, type LiveEventType, type LivePlayerVM, type MatchPeriod, type Side } from '@/modules/matches/client'
import type { LiveEvent } from './live-state'
import { playerTag } from './selectors'

export const TIMELINE_MARKER = { HALF_TIME: 'intervalo', FULL_TIME: 'fim' } as const

export type TimelineMarker = (typeof TIMELINE_MARKER)[keyof typeof TIMELINE_MARKER]

export type TimelineItem = {
  key: string
  side: Side | null
  kind: LiveEventType | TimelineMarker
  minuteLabel: string
  text: string
}

const PERIOD_LABEL: Record<MatchPeriod, string> = {
  [MATCH_PERIOD.BEFORE_START]: 'Pré',
  [MATCH_PERIOD.FIRST_HALF]: '1ºT',
  [MATCH_PERIOD.HALF_TIME]: 'Int.',
  [MATCH_PERIOD.SECOND_HALF]: '2ºT',
  [MATCH_PERIOD.FIRST_EXTRA_HALF]: '1ºP',
  [MATCH_PERIOD.SECOND_EXTRA_HALF]: '2ºP',
  [MATCH_PERIOD.PENALTIES]: 'Pên.',
  [MATCH_PERIOD.FULL_TIME]: 'Fim',
}

const FIRST_HALF_PERIODS: readonly MatchPeriod[] = [MATCH_PERIOD.BEFORE_START, MATCH_PERIOD.FIRST_HALF]

export const minuteLabel = (period: MatchPeriod, minute: number | null): string => (minute === null ? PERIOD_LABEL[period] : `${PERIOD_LABEL[period]} ${minute}'`)

export const describeEvent = (event: LiveEvent, playersById: Record<string, LivePlayerVM>): string => {
  const player = event.playerId ? playersById[event.playerId] : undefined
  const tag = playerTag(player)

  if (event.type === LIVE_EVENT_TYPE.GOAL) {
    const assistant = event.assistPlayerId ? playersById[event.assistPlayerId] : undefined
    const title = event.goalType === GOAL_TYPE.OWN_GOAL ? 'GOL CONTRA' : 'GOL'

    return `${title} — ${tag}${assistant ? ` · ASSIST. ${playerTag(assistant)}` : ''}`
  }
  if (event.type === LIVE_EVENT_TYPE.YELLOW_CARD) return `AMARELO — ${tag}`
  if (event.type === LIVE_EVENT_TYPE.RED_CARD) return event.fromSecondYellow ? `VERMELHO (2º AMARELO) — ${tag}` : `VERMELHO — ${tag}`

  const playerOut = event.playerOutId ? playersById[event.playerOutId] : undefined

  return `SUBSTITUIÇÃO — SAI #${playerOut?.shirtNumber ?? '?'} · ENTRA #${player?.shirtNumber ?? '?'}`
}

const toItem = (event: LiveEvent, playersById: Record<string, LivePlayerVM>): TimelineItem => ({
  key: event.key,
  side: event.side,
  kind: event.type,
  minuteLabel: minuteLabel(event.period, event.minute),
  text: describeEvent(event, playersById),
})

const markerItem = (marker: TimelineMarker, period: MatchPeriod, minute: number | null, text: string): TimelineItem[] =>
  minute === null ? [] : [{ key: marker, side: null, kind: marker, minuteLabel: minuteLabel(period, minute), text }]

export const buildTimeline = (events: LiveEvent[], clock: LiveClock, playersById: Record<string, LivePlayerVM>): TimelineItem[] => {
  const firstHalf = events.filter((event) => FIRST_HALF_PERIODS.includes(event.period))
  const rest = events.filter((event) => !FIRST_HALF_PERIODS.includes(event.period))

  return [
    ...firstHalf.map((event) => toItem(event, playersById)),
    ...markerItem(TIMELINE_MARKER.HALF_TIME, MATCH_PERIOD.FIRST_HALF, clock.firstHalfMinutes, 'Intervalo'),
    ...rest.map((event) => toItem(event, playersById)),
    ...markerItem(TIMELINE_MARKER.FULL_TIME, MATCH_PERIOD.SECOND_HALF, clock.secondHalfMinutes, 'Fim de jogo'),
  ]
}
