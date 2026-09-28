import { z } from 'zod'
import { LiveClockSchema } from '../live-clock/live-clock'
import { DATA_SOURCE, GOAL_TYPE, LIVE_EVENT_TYPE, MATCH_PERIOD, SIDE } from '../live-match/live-match'

export const STREAM_MESSAGE = { MATCH_EVENT: 'match-event', SNAPSHOT_CHANGED: 'snapshot-changed' } as const

const PitchCoordinate = z.number().min(0).max(100)

export const RemoteEventSchema = z.object({
  seq: z.number().int(),
  key: z.string().min(1),
  isActive: z.boolean(),
  side: z.enum([SIDE.HOME, SIDE.AWAY]),
  type: z.enum([LIVE_EVENT_TYPE.GOAL, LIVE_EVENT_TYPE.YELLOW_CARD, LIVE_EVENT_TYPE.RED_CARD, LIVE_EVENT_TYPE.SUBSTITUTION]),
  period: z.enum(Object.values(MATCH_PERIOD)),
  minute: z.number().int().nullable(),
  playerId: z.string().nullable(),
  playerOutId: z.string().nullable(),
  assistPlayerId: z.string().nullable(),
  goalType: z.enum(Object.values(GOAL_TYPE)).nullable(),
  fromSecondYellow: z.boolean(),
  source: z.enum(Object.values(DATA_SOURCE)),
})

export type RemoteEvent = z.infer<typeof RemoteEventSchema>

export const RemotePositionSchema = z.object({ playerId: z.string().min(1), x: PitchCoordinate, y: PitchCoordinate })

export type RemotePosition = z.infer<typeof RemotePositionSchema>

export const RemoteSnapshotSchema = z.object({
  seq: z.number().int(),
  clock: LiveClockSchema.nullable(),
  positions: z.array(RemotePositionSchema),
})

export type RemoteSnapshot = z.infer<typeof RemoteSnapshotSchema>
