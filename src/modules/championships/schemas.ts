import { z } from 'zod'
import { CATEGORY } from './categories'

export const CHAMPIONSHIP_NAME_MIN_LENGTH = 3
export const CHAMPIONSHIP_NAME_MAX_LENGTH = 80
export const CHAMPIONSHIP_PHASE_MAX_LENGTH = 60
export const CHAMPIONSHIP_MAX_CLUBS = 64
export const CHAMPIONSHIP_YEAR_MIN = 2000
export const CHAMPIONSHIP_YEAR_MAX = 2100

export const CreateChampionshipInput = z.object({
  name: z
    .string()
    .trim()
    .min(CHAMPIONSHIP_NAME_MIN_LENGTH, 'Use pelo menos 3 caracteres no nome.')
    .max(CHAMPIONSHIP_NAME_MAX_LENGTH, 'Use no máximo 80 caracteres no nome.'),
  category: z.enum([CATEGORY.SUB13, CATEGORY.SUB14], 'Escolha a categoria.'),
  year: z.coerce.number('Informe a temporada.').int('Informe a temporada.').min(CHAMPIONSHIP_YEAR_MIN, 'Temporada inválida.').max(CHAMPIONSHIP_YEAR_MAX, 'Temporada inválida.'),
  phase: z.string().trim().max(CHAMPIONSHIP_PHASE_MAX_LENGTH).optional(),
  clubIds: z.array(z.uuid()).max(CHAMPIONSHIP_MAX_CLUBS, 'Escolha no máximo 64 times.'),
})

export type CreateChampionshipData = z.infer<typeof CreateChampionshipInput>
