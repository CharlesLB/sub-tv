import { z } from 'zod'
import { parseHtml, textOf } from '../../html-text/html-text'
import { sanitizePersonName } from '../../text-normalization/text-normalization'

const TOP_SCORER_CELL_COUNT = 4

const TopScorerSchema = z.object({
  goals: z.coerce.number().int().min(1),
  nickname: z.string().transform((value) => sanitizePersonName(value) || null),
  fullName: z.string().transform(sanitizePersonName).pipe(z.string().min(1)),
  clubName: z.string().min(1),
})

export type TopScorerRow = z.infer<typeof TopScorerSchema>

export const parseTopScorersTab = (sectionHtml: string): TopScorerRow[] =>
  parseHtml(sectionHtml)
    .querySelectorAll('tr')
    .map((row) => row.querySelectorAll('td').map((cell) => textOf(cell)))
    .filter((cells) => cells.length === TOP_SCORER_CELL_COUNT)
    .flatMap(([goals, nickname, fullName, clubName]) => {
      const parsed = TopScorerSchema.safeParse({ goals, nickname, fullName, clubName })

      return parsed.success ? [parsed.data] : []
    })
