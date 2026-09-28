import { LIVE_EVENT_TYPE, SIDE } from '@/modules/matches/client'
import { TIMELINE_MARKER, type TimelineItem } from '../../state/timeline'

export const homeGoalItemFixture: TimelineItem = {
  key: 'goal-home-9',
  side: SIDE.HOME,
  kind: LIVE_EVENT_TYPE.GOAL,
  minuteLabel: "1ºT 12'",
  text: 'GOL — #9 Davi Moreira · ASSIST. #10 Enzo Barbosa',
}

export const awayYellowCardItemFixture: TimelineItem = {
  key: 'yellow-away-9',
  side: SIDE.AWAY,
  kind: LIVE_EVENT_TYPE.YELLOW_CARD,
  minuteLabel: "1ºT 20'",
  text: 'AMARELO — #9 Theo Assis',
}

export const halfTimeItemFixture: TimelineItem = {
  key: TIMELINE_MARKER.HALF_TIME,
  side: null,
  kind: TIMELINE_MARKER.HALF_TIME,
  minuteLabel: "1ºT 30'",
  text: 'Intervalo',
}
