import { z } from 'zod'
import { LiveClockSchema } from '../live-clock/live-clock'
import { LIVE_EVENT_TYPE, MATCH_PERIOD, MAXIMUM_EVENT_MINUTE, SIDE } from '../live-match/live-match'

const PITCH_MINIMUM = 0
const PITCH_MAXIMUM = 100

const SideSchema = z.enum([SIDE.HOME, SIDE.AWAY])

const EventPeriodSchema = z.enum([MATCH_PERIOD.FIRST_HALF, MATCH_PERIOD.HALF_TIME, MATCH_PERIOD.SECOND_HALF, MATCH_PERIOD.FULL_TIME])

const EventMinuteSchema = z.number().int().min(0).max(MAXIMUM_EVENT_MINUTE).nullable()

const PitchCoordinate = z.number().min(PITCH_MINIMUM).max(PITCH_MAXIMUM)

const PitchPointSchema = z.object({ x: PitchCoordinate, y: PitchCoordinate })

export const RecordLiveEventInput = z.object({
  matchId: z.uuid(),
  clientId: z.uuid(),
  type: z.enum([LIVE_EVENT_TYPE.GOAL, LIVE_EVENT_TYPE.YELLOW_CARD, LIVE_EVENT_TYPE.RED_CARD]),
  side: SideSchema,
  period: EventPeriodSchema,
  minute: EventMinuteSchema,
  playerId: z.uuid(),
  fromSecondYellow: z.boolean().default(false),
})

export type RecordLiveEventInput = z.input<typeof RecordLiveEventInput>

export const ApplySubstitutionInput = z
  .object({
    matchId: z.uuid(),
    clientId: z.uuid(),
    side: SideSchema,
    period: EventPeriodSchema,
    minute: EventMinuteSchema,
    playerInId: z.uuid(),
    playerOutId: z.uuid(),
    pitchPoint: PitchPointSchema.nullable().default(null),
  })
  .refine((input) => input.playerInId !== input.playerOutId, { message: 'Quem entra e quem sai precisam ser atletas diferentes.', path: ['playerInId'] })

export type ApplySubstitutionInput = z.input<typeof ApplySubstitutionInput>

export const RevertLiveEventInput = z.object({ matchId: z.uuid(), eventKey: z.uuid() })

export type RevertLiveEventInput = z.input<typeof RevertLiveEventInput>

export const AttachAssistInput = z.object({ matchId: z.uuid(), goalKey: z.uuid(), assistPlayerId: z.uuid().nullable() })

export type AttachAssistInput = z.input<typeof AttachAssistInput>

export const UpdateLiveClockInput = z.object({ matchId: z.uuid(), clock: LiveClockSchema })

export type UpdateLiveClockInput = z.input<typeof UpdateLiveClockInput>

export const UpdateLineupPositionInput = z.object({
  matchId: z.uuid(),
  playerId: z.uuid(),
  pitchX: PitchCoordinate,
  pitchY: PitchCoordinate,
})

export type UpdateLineupPositionInput = z.input<typeof UpdateLineupPositionInput>
