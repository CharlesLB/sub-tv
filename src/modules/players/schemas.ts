import { z } from 'zod'
import { CATEGORY } from '@/modules/championships/client'

export const PLAYER_POSITIONS = ['goleiro', 'zagueiro', 'lateral', 'volante', 'meia', 'atacante'] as const
export const PREFERRED_FEET = ['destro', 'canhoto', 'ambidestro'] as const

export const PlayerPositionSchema = z.enum(PLAYER_POSITIONS)
export const PreferredFootSchema = z.enum(PREFERRED_FEET)

export const CURIOSITY_MAX_LENGTH = 160
export const DISPLAY_NAME_MAX_LENGTH = 30
export const FULL_NAME_MIN_LENGTH = 3
export const FULL_NAME_MAX_LENGTH = 80
export const SHIRT_NUMBER_MIN = 1
export const SHIRT_NUMBER_MAX = 99

const emptyToUndefined = (value: unknown): unknown => (value === '' ? undefined : value)

export const UpdatePlayerProfileInput = z.object({
  playerId: z.uuid(),
  displayName: z.string().trim().max(DISPLAY_NAME_MAX_LENGTH, 'Use no máximo 30 caracteres.').optional(),
  position: z.preprocess(emptyToUndefined, PlayerPositionSchema.optional()),
  preferredFoot: z.preprocess(emptyToUndefined, PreferredFootSchema.optional()),
})

export const AddCuriosityInput = z.object({
  playerId: z.uuid(),
  text: z.string().trim().min(1, 'Escreva a curiosidade.').max(CURIOSITY_MAX_LENGTH, 'Use no máximo 160 caracteres.'),
})

export const RemoveCuriosityInput = z.object({
  curiosityId: z.uuid(),
})

export const CreateManualPlayerInput = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  category: z.enum([CATEGORY.SUB13, CATEGORY.SUB14]),
  clubId: z.uuid(),
  fullName: z.string().trim().min(FULL_NAME_MIN_LENGTH, 'Informe o nome completo.').max(FULL_NAME_MAX_LENGTH, 'Use no máximo 80 caracteres.'),
  shirtNumber: z.coerce.number('Informe o número.').int('Informe o número.').min(SHIRT_NUMBER_MIN, 'Número de 1 a 99.').max(SHIRT_NUMBER_MAX, 'Número de 1 a 99.'),
})

export type UpdatePlayerProfileData = z.infer<typeof UpdatePlayerProfileInput>
export type AddCuriosityData = z.infer<typeof AddCuriosityInput>
export type RemoveCuriosityData = z.infer<typeof RemoveCuriosityInput>
export type CreateManualPlayerData = z.infer<typeof CreateManualPlayerInput>
