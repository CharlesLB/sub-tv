import type { HTMLElement } from 'node-html-parser'
import { z } from 'zod'
import { parseHtml, textOf } from '../../html-text/html-text'
import { type TeamReference, readCrestReference, splitPhasePanes } from '../page-sections/page-sections'

const STANDING_CELL_COUNT = 12
const GROUP_PATTERN = /^GRUPO\s+(\S+)/i

const StandingNumbersSchema = z.object({
  position: z.coerce.number().int().min(1),
  points: z.coerce.number().int(),
  played: z.coerce.number().int().min(0),
  wins: z.coerce.number().int().min(0),
  draws: z.coerce.number().int().min(0),
  losses: z.coerce.number().int().min(0),
  goalsFor: z.coerce.number().int().min(0),
  goalsAgainst: z.coerce.number().int().min(0),
})

export type StandingRow = z.infer<typeof StandingNumbersSchema> & {
  phase: string
  groupName: string | null
  team: TeamReference
}

type StandingAccumulator = { groupName: string | null; rows: StandingRow[] }

const readTeam = (cells: HTMLElement[]): TeamReference | null => {
  const crest = readCrestReference(cells[1]?.querySelector('img')?.getAttribute('src') ?? '')
  const shortName = textOf(cells[2]) || (cells[1]?.querySelector('img')?.getAttribute('alt') ?? '').trim()

  return crest && shortName ? { ...crest, shortName } : null
}

const readStandingRow = (phase: string, groupName: string | null, cells: HTMLElement[]): StandingRow | null => {
  const team = readTeam(cells)
  const numbers = StandingNumbersSchema.safeParse({
    position: textOf(cells[0]),
    points: textOf(cells[3]),
    played: textOf(cells[4]),
    wins: textOf(cells[5]),
    draws: textOf(cells[6]),
    losses: textOf(cells[7]),
    goalsFor: textOf(cells[8]),
    goalsAgainst: textOf(cells[9]),
  })
  if (!team || !numbers.success) return null

  return { ...numbers.data, phase, groupName, team }
}

const parsePane = (phase: string, paneHtml: string): StandingRow[] =>
  parseHtml(paneHtml)
    .querySelectorAll('tr')
    .map((row) => row.querySelectorAll('td'))
    .reduce<StandingAccumulator>(
      (accumulator, cells) => {
        const groupMatch = cells.length === 1 ? GROUP_PATTERN.exec(textOf(cells[0])) : null
        if (groupMatch) return { ...accumulator, groupName: groupMatch[1] ?? null }
        if (cells.length !== STANDING_CELL_COUNT) return accumulator
        const standing = readStandingRow(phase, accumulator.groupName, cells)

        return standing ? { ...accumulator, rows: [...accumulator.rows, standing] } : accumulator
      },
      { groupName: null, rows: [] },
    ).rows

export const parseStandingsTab = (sectionHtml: string, paneIdPrefix: string): StandingRow[] =>
  splitPhasePanes(sectionHtml, paneIdPrefix).flatMap((pane) => parsePane(pane.name, pane.html))
