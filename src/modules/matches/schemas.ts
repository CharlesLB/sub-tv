import { z } from 'zod'
import { STARTERS_PER_TEAM } from './lib/default-starters/default-starters'
import { isDateInput, isTimeInput } from './lib/kickoff-time/kickoff-time'
import { PitchPointSchema } from './lib/pitch-coordinate/pitch-coordinate'

export const MAXIMUM_ROUND = 99
export const MAXIMUM_VENUE_LENGTH = 120

const StarterIds = z
  .array(z.uuid())
  .length(STARTERS_PER_TEAM, 'Escolha exatamente 11 titulares.')
  .refine((playerIds) => new Set(playerIds).size === playerIds.length, 'Um atleta aparece duas vezes entre os titulares.')

const StarterPositions = z
  .array(PitchPointSchema.extend({ playerId: z.uuid() }))
  .max(STARTERS_PER_TEAM)
  .optional()

export const CreateBroadcastMatchInput = z
  .object({
    seasonId: z.uuid(),
    existingMatchId: z.uuid().optional(),
    kickoffDate: z.string().refine(isDateInput, 'Informe uma data válida.'),
    kickoffTime: z.string().refine(isTimeInput, 'Informe um horário válido.'),
    round: z.coerce.number().int().min(1).max(MAXIMUM_ROUND),
    venue: z.string().trim().min(1, 'Informe o local.').max(MAXIMUM_VENUE_LENGTH),
    homeSeasonTeamId: z.uuid(),
    awaySeasonTeamId: z.uuid(),
    homeStarterIds: StarterIds,
    awayStarterIds: StarterIds,
    homeStarterPositions: StarterPositions,
    awayStarterPositions: StarterPositions,
  })
  .refine((input) => input.homeSeasonTeamId !== input.awaySeasonTeamId, { message: 'Mandante e visitante precisam ser times diferentes.', path: ['awaySeasonTeamId'] })

export type CreateBroadcastMatchInput = z.infer<typeof CreateBroadcastMatchInput>
