'use client'

import { useEffect, useState, type Dispatch } from 'react'
import type { ActionResult } from '@/lib/actions/result'
import {
  applySubstitution,
  attachAssist,
  LIVE_EVENT_TYPE,
  MATCH_PERIOD,
  recordLiveEvent,
  revertLiveEvent,
  updateLineupPosition,
  updateLiveClock,
  type LiveEventType,
  type MatchPeriod,
} from '@/modules/matches/client'
import { LIVE_ACTION, type LiveAction } from '../state/live-actions'
import { SERVER_OPERATION, syncKeyOf, type LiveEvent, type ServerOperation } from '../state/live-state'
import { createEventQueue, SEND_OUTCOME, type EventQueue, type QueuedItem, type SendOutcome } from './event-queue'

const UNSENDABLE_EVENT = 'Lance sem atleta ou período válido.'

type SendablePeriod = typeof MATCH_PERIOD.FIRST_HALF | typeof MATCH_PERIOD.HALF_TIME | typeof MATCH_PERIOD.SECOND_HALF | typeof MATCH_PERIOD.FULL_TIME

type CardOrGoalType = typeof LIVE_EVENT_TYPE.GOAL | typeof LIVE_EVENT_TYPE.YELLOW_CARD | typeof LIVE_EVENT_TYPE.RED_CARD

const SENDABLE_PERIODS: Partial<Record<MatchPeriod, SendablePeriod>> = {
  [MATCH_PERIOD.FIRST_HALF]: MATCH_PERIOD.FIRST_HALF,
  [MATCH_PERIOD.HALF_TIME]: MATCH_PERIOD.HALF_TIME,
  [MATCH_PERIOD.SECOND_HALF]: MATCH_PERIOD.SECOND_HALF,
  [MATCH_PERIOD.FULL_TIME]: MATCH_PERIOD.FULL_TIME,
}

const RECORDABLE_TYPES: Partial<Record<LiveEventType, CardOrGoalType>> = {
  [LIVE_EVENT_TYPE.GOAL]: LIVE_EVENT_TYPE.GOAL,
  [LIVE_EVENT_TYPE.YELLOW_CARD]: LIVE_EVENT_TYPE.YELLOW_CARD,
  [LIVE_EVENT_TYPE.RED_CARD]: LIVE_EVENT_TYPE.RED_CARD,
}

const toOutcome = <TData>(result: ActionResult<TData>): SendOutcome => (result.ok ? { status: SEND_OUTCOME.SENT } : { status: SEND_OUTCOME.REJECTED, message: result.error })

const rejected: SendOutcome = { status: SEND_OUTCOME.REJECTED, message: UNSENDABLE_EVENT }

const sendRecord = async (matchId: string, event: LiveEvent): Promise<SendOutcome> => {
  const period = SENDABLE_PERIODS[event.period]
  const type = RECORDABLE_TYPES[event.type]
  if (!period || !type || !event.playerId) return rejected

  return toOutcome(
    await recordLiveEvent({ matchId, clientId: event.key, type, side: event.side, period, minute: event.minute, playerId: event.playerId, fromSecondYellow: event.fromSecondYellow }),
  )
}

const sendSubstitution = async (matchId: string, operation: Extract<ServerOperation, { kind: typeof SERVER_OPERATION.SUBSTITUTION }>): Promise<SendOutcome> => {
  const { event, pitchPoint } = operation
  const period = SENDABLE_PERIODS[event.period]
  if (!period || !event.playerId || !event.playerOutId) return rejected

  return toOutcome(
    await applySubstitution({ matchId, clientId: event.key, side: event.side, period, minute: event.minute, playerInId: event.playerId, playerOutId: event.playerOutId, pitchPoint }),
  )
}

const sendOperation = async (matchId: string, operation: ServerOperation): Promise<SendOutcome> => {
  switch (operation.kind) {
    case SERVER_OPERATION.RECORD:
      return sendRecord(matchId, operation.event)
    case SERVER_OPERATION.SUBSTITUTION:
      return sendSubstitution(matchId, operation)
    case SERVER_OPERATION.REVERT:
      return toOutcome(await revertLiveEvent({ matchId, eventKey: operation.eventKey }))
    case SERVER_OPERATION.ASSIST:
      return toOutcome(await attachAssist({ matchId, goalKey: operation.goalKey, assistPlayerId: operation.assistPlayerId }))
    case SERVER_OPERATION.CLOCK:
      return toOutcome(await updateLiveClock({ matchId, clock: operation.clock }))
    case SERVER_OPERATION.POSITION:
      return toOutcome(await updateLineupPosition({ matchId, playerId: operation.playerId, pitchX: operation.point.x, pitchY: operation.point.y }))
  }
}

const COALESCING_KINDS: readonly ServerOperation['kind'][] = [SERVER_OPERATION.CLOCK, SERVER_OPERATION.POSITION]

const coalesceKeyOf = (operation: ServerOperation): string | null => (COALESCING_KINDS.includes(operation.kind) ? syncKeyOf(operation) : null)

const waitFor = (milliseconds: number) => new Promise<void>((resolve) => setTimeout(resolve, milliseconds))

const createLiveQueue = (matchId: string, dispatch: Dispatch<LiveAction>): EventQueue<ServerOperation> =>
  createEventQueue<ServerOperation>({
    send: (operation) => sendOperation(matchId, operation),
    onSent: (operation) => dispatch({ type: LIVE_ACTION.SYNC_CONFIRMED, syncKey: syncKeyOf(operation) }),
    onDropped: (operation) => dispatch({ type: LIVE_ACTION.SYNC_CONFIRMED, syncKey: syncKeyOf(operation) }),
    onRejected: (operation, message) => dispatch({ type: LIVE_ACTION.SYNC_REJECTED, syncKey: syncKeyOf(operation), message }),
    onFailure: () => dispatch({ type: LIVE_ACTION.SYNC_FAILED }),
    onRecovered: () => dispatch({ type: LIVE_ACTION.SYNC_RECOVERED }),
    wait: waitFor,
  })

const warnBeforeLeaving = (event: BeforeUnloadEvent) => event.preventDefault()

export const useLiveSync = (matchId: string, outbox: ServerOperation[], hasPendingSync: boolean, dispatch: Dispatch<LiveAction>): void => {
  const [queue] = useState(() => createLiveQueue(matchId, dispatch))

  useEffect(() => {
    if (!hasPendingSync) return
    window.addEventListener('beforeunload', warnBeforeLeaving)

    return () => window.removeEventListener('beforeunload', warnBeforeLeaving)
  }, [hasPendingSync])

  useEffect(() => {
    if (outbox.length === 0) return
    const items: QueuedItem<ServerOperation>[] = outbox.map((operation) => ({ operation, coalesceKey: coalesceKeyOf(operation) }))
    queue.enqueue(items)
    dispatch({ type: LIVE_ACTION.OUTBOX_DRAINED, count: outbox.length })
  }, [outbox, queue, dispatch])
}
