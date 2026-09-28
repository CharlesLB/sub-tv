import { LIVE_EVENT_TYPE, SIDE } from '@/modules/matches/client'
import { TIMELINE_MARKER, type TimelineItem } from '../../state/timeline'

export const goalItemFixture: TimelineItem = {
  key: 'goal-home-9',
  side: SIDE.HOME,
  kind: LIVE_EVENT_TYPE.GOAL,
  minuteLabel: "1ºT 12'",
  text: 'GOL — #9 Davi · ASSIST. #10 Heitor',
}

export const yellowCardItemFixture: TimelineItem = {
  key: 'yellow-away-9',
  side: SIDE.AWAY,
  kind: LIVE_EVENT_TYPE.YELLOW_CARD,
  minuteLabel: "1ºT 20'",
  text: 'AMARELO — #9 Otávio',
}

export const halfTimeItemFixture: TimelineItem = {
  key: TIMELINE_MARKER.HALF_TIME,
  side: null,
  kind: TIMELINE_MARKER.HALF_TIME,
  minuteLabel: "1ºT 25'",
  text: 'Intervalo',
}

export const substitutionItemFixture: TimelineItem = {
  key: 'substitution-home-12',
  side: SIDE.HOME,
  kind: LIVE_EVENT_TYPE.SUBSTITUTION,
  minuteLabel: "2ºT 3'",
  text: 'SUBSTITUIÇÃO — SAI #10 · ENTRA #12',
}

export const timelineFixture: TimelineItem[] = [goalItemFixture, yellowCardItemFixture, halfTimeItemFixture, substitutionItemFixture]
