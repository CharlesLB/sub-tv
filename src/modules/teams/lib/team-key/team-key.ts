import { z } from 'zod'
import { CATEGORY, type Category } from '@/modules/championships/client'

export type TeamKey = { category: Category; clubId: string }

const TEAM_KEY_SEPARATOR = '-'

const CATEGORY_LENGTH = 5

const TeamKeySchema = z.object({
  category: z.enum([CATEGORY.SUB13, CATEGORY.SUB14]),
  clubId: z.uuid(),
})

export const toTeamKey = (category: Category, clubId: string): string => `${category}${TEAM_KEY_SEPARATOR}${clubId}`

export const parseTeamKey = (value: string | null | undefined): TeamKey | null => {
  if (!value) {
    return null
  }

  const candidate = {
    category: value.slice(0, CATEGORY_LENGTH),
    clubId: value.slice(CATEGORY_LENGTH + TEAM_KEY_SEPARATOR.length),
  }

  const hasSeparator = value.charAt(CATEGORY_LENGTH) === TEAM_KEY_SEPARATOR
  const parsed = TeamKeySchema.safeParse(candidate)

  return hasSeparator && parsed.success ? parsed.data : null
}
