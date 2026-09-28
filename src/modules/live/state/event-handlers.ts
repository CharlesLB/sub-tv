import { type ClockPeriod, DATA_SOURCE, GOAL_TYPE, LIVE_EVENT_TYPE, type LiveClock, type LivePlayerVM, MATCH_PERIOD, type MatchPeriod, minuteAt } from '@/modules/matches/client'
import { CARD_COLOR, type CardColor } from './live-actions'
import { type LiveEvent, type LiveState, type PlayerMatchState, SERVER_OPERATION, SYNC_STATE, TOAST_TONE } from './live-state'
import { derivePlayerStates, findLatestOpenGoal, playerTag } from './selectors'
import { enqueue, LIVE_MESSAGE, pushToast, warn } from './toasts'

const EVENT_PERIOD_BY_CLOCK: Record<ClockPeriod, MatchPeriod> = {
  [MATCH_PERIOD.BEFORE_START]: MATCH_PERIOD.FIRST_HALF,
  [MATCH_PERIOD.FIRST_HALF]: MATCH_PERIOD.FIRST_HALF,
  [MATCH_PERIOD.HALF_TIME]: MATCH_PERIOD.HALF_TIME,
  [MATCH_PERIOD.SECOND_HALF]: MATCH_PERIOD.SECOND_HALF,
  [MATCH_PERIOD.FULL_TIME]: MATCH_PERIOD.FULL_TIME,
}

const PERIODS_WITHOUT_MINUTE: readonly ClockPeriod[] = [MATCH_PERIOD.HALF_TIME, MATCH_PERIOD.FULL_TIME]

const eventMinute = (clock: LiveClock, nowMs: number): number | null => {
  if (PERIODS_WITHOUT_MINUTE.includes(clock.period)) return null

  return clock.period === MATCH_PERIOD.BEFORE_START ? 0 : minuteAt(clock, nowMs)
}

type EventFields = Pick<LiveEvent, 'key' | 'type' | 'side' | 'playerId'> & Partial<Pick<LiveEvent, 'playerOutId' | 'goalType' | 'fromSecondYellow'>>

const createEvent = (state: LiveState, fields: EventFields, nowMs: number): LiveEvent => ({
  playerOutId: null,
  assistPlayerId: null,
  goalType: null,
  fromSecondYellow: false,
  ...fields,
  period: EVENT_PERIOD_BY_CLOCK[state.clock.period],
  minute: eventMinute(state.clock, nowMs),
  source: DATA_SOURCE.LIVE,
  appliedToLineup: false,
  syncState: SYNC_STATE.PENDING,
})

type ActivePlayer = { player: LivePlayerVM; matchState: PlayerMatchState }

const activePlayerOf = (state: LiveState, playerId: string): ActivePlayer | null => {
  const player = state.playersById[playerId]
  const matchState = derivePlayerStates(state.players, state.events)[playerId]

  return player && matchState?.onPitch ? { player, matchState } : null
}

const addEvents = (state: LiveState, events: LiveEvent[]): LiveState => ({
  ...enqueue(state, ...events.map((event) => ({ kind: SERVER_OPERATION.RECORD, event }))),
  events: [...state.events, ...events],
})

export const recordGoal = (state: LiveState, playerId: string, clientId: string, nowMs: number): LiveState => {
  const active = activePlayerOf(state, playerId)
  if (!active) return warn(state, LIVE_MESSAGE.SELECT_PLAYER)
  if (active.matchState.sentOff) return warn(state, LIVE_MESSAGE.PLAYER_SENT_OFF)

  const goal = createEvent(state, { key: clientId, type: LIVE_EVENT_TYPE.GOAL, side: active.player.side, playerId, goalType: GOAL_TYPE.NORMAL }, nowMs)
  const withGoal = { ...addEvents(state, [goal]), pulseCount: state.pulseCount + 1, selectedPlayerId: playerId }

  return pushToast(withGoal, `GOL MARCADO — ${playerTag(active.player)}`, TOAST_TONE.OK, { addedEventKeys: [clientId], assistChange: null })
}

export const recordAssist = (state: LiveState, playerId: string): LiveState => {
  const active = activePlayerOf(state, playerId)
  if (!active) return warn(state, LIVE_MESSAGE.SELECT_PLAYER)

  const goal = findLatestOpenGoal(state.events, active.player.side)
  if (!goal) return warn(state, LIVE_MESSAGE.GOAL_BEFORE_ASSIST)
  if (goal.playerId === playerId) return warn(state, LIVE_MESSAGE.SCORER_CANNOT_ASSIST)

  const withAssist = enqueue(
    { ...state, selectedPlayerId: playerId, events: state.events.map((event) => (event.key === goal.key ? { ...event, assistPlayerId: playerId, syncState: SYNC_STATE.PENDING } : event)) },
    { kind: SERVER_OPERATION.ASSIST, goalKey: goal.key, assistPlayerId: playerId },
  )

  return pushToast(withAssist, `ASSISTÊNCIA — ${playerTag(active.player)}`, TOAST_TONE.OK, {
    addedEventKeys: [],
    assistChange: { goalKey: goal.key, previousAssistPlayerId: null },
  })
}

type CardInput = { playerId: string; color: CardColor; clientIds: readonly [string, string]; nowMs: number }

export const recordCard = (state: LiveState, { playerId, color, clientIds, nowMs }: CardInput): LiveState => {
  const closed = { ...state, cardPickerOpen: false }
  const active = activePlayerOf(closed, playerId)
  if (!active) return warn(closed, LIVE_MESSAGE.SELECT_PLAYER)
  if (active.matchState.sentOff) return warn(closed, LIVE_MESSAGE.PLAYER_ALREADY_SENT_OFF)

  const [firstKey, secondKey] = clientIds
  const tag = playerTag(active.player)
  const side = active.player.side
  const isSecondYellow = color === CARD_COLOR.YELLOW && active.matchState.yellowCards >= 1
  const firstType = color === CARD_COLOR.YELLOW ? LIVE_EVENT_TYPE.YELLOW_CARD : LIVE_EVENT_TYPE.RED_CARD
  const firstCard = createEvent(closed, { key: firstKey, type: firstType, side, playerId }, nowMs)
  const secondYellowRed = createEvent(closed, { key: secondKey, type: LIVE_EVENT_TYPE.RED_CARD, side, playerId, fromSecondYellow: true }, nowMs)
  const cards = isSecondYellow ? [firstCard, secondYellowRed] : [firstCard]
  const message = isSecondYellow ? `EXPULSO POR 2º AMARELO — ${tag}` : color === CARD_COLOR.YELLOW ? `AMARELO — ${tag}` : `VERMELHO — ${tag}`
  const tone = isSecondYellow ? TOAST_TONE.WARN : TOAST_TONE.OK

  return pushToast({ ...addEvents(closed, cards), selectedPlayerId: playerId }, message, tone, { addedEventKeys: cards.map((card) => card.key), assistChange: null })
}

type SubstitutionInput = { playerOutId: string; playerInId: string; clientId: string; nowMs: number }

export const recordSubstitution = (state: LiveState, { playerOutId, playerInId, clientId, nowMs }: SubstitutionInput): LiveState => {
  const settled = { ...state, pendingSubstitution: false }
  const states = derivePlayerStates(state.players, state.events)
  const playerOut = state.playersById[playerOutId]
  const playerIn = state.playersById[playerInId]
  const outState = states[playerOutId]
  const inState = states[playerInId]
  if (outState?.sentOff) return warn(settled, LIVE_MESSAGE.SENT_OFF_CANNOT_BE_SUBSTITUTED)

  if (!playerOut || !playerIn || !outState?.onPitch || !inState || inState.onPitch || inState.subbedOut || playerOut.side !== playerIn.side) {
    return warn(settled, LIVE_MESSAGE.INVALID_SUBSTITUTION)
  }

  const pitchPoint = state.positions[playerOutId] ?? null
  const substitution = createEvent(state, { key: clientId, type: LIVE_EVENT_TYPE.SUBSTITUTION, side: playerIn.side, playerId: playerInId, playerOutId }, nowMs)

  const withSubstitution = enqueue(
    {
      ...settled,
      events: [...state.events, substitution],
      positions: pitchPoint ? { ...state.positions, [playerInId]: pitchPoint } : state.positions,
      selectedPlayerId: playerInId,
    },
    { kind: SERVER_OPERATION.SUBSTITUTION, event: substitution, pitchPoint },
  )

  return pushToast(withSubstitution, `SUBSTITUIÇÃO — ENTRA ${playerTag(playerIn)}`, TOAST_TONE.OK, { addedEventKeys: [clientId], assistChange: null })
}

export const startSubstitution = (state: LiveState): LiveState => {
  const active = state.selectedPlayerId ? activePlayerOf(state, state.selectedPlayerId) : null
  if (!active) return warn(state, LIVE_MESSAGE.SELECT_PLAYER)
  if (active.matchState.sentOff) return warn(state, LIVE_MESSAGE.SENT_OFF_CANNOT_BE_SUBSTITUTED)

  return { ...state, pendingSubstitution: true }
}

export const openCardPicker = (state: LiveState): LiveState => {
  const active = state.selectedPlayerId ? activePlayerOf(state, state.selectedPlayerId) : null

  return active ? { ...state, cardPickerOpen: true } : warn(state, LIVE_MESSAGE.SELECT_PLAYER)
}
