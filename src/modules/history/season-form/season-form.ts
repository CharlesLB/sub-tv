import * as R from 'remeda'
import type { FormResult } from '@/modules/championships/client'

const FORM_LENGTH = 5
const FORM_RESULT = { WIN: 'V', DRAW: 'E', LOSS: 'D' } as const satisfies Record<string, FormResult>

export type FinishedTeamMatch = {
  year: number
  homeTeamId: string
  awayTeamId: string
  homeScore: number
  awayScore: number
}

const resultFor = (goalsScored: number, goalsConceded: number): FormResult => {
  if (goalsScored > goalsConceded) return FORM_RESULT.WIN
  if (goalsScored < goalsConceded) return FORM_RESULT.LOSS

  return FORM_RESULT.DRAW
}

const resultOfTeam = (match: FinishedTeamMatch, seasonTeamIds: ReadonlySet<string>): FormResult =>
  seasonTeamIds.has(match.homeTeamId) ? resultFor(match.homeScore, match.awayScore) : resultFor(match.awayScore, match.homeScore)

export const buildFormByYear = (matchesInKickoffOrder: readonly FinishedTeamMatch[], seasonTeamIds: ReadonlySet<string>): Record<number, FormResult[]> =>
  R.pipe(
    [...matchesInKickoffOrder],
    R.filter((match) => seasonTeamIds.has(match.homeTeamId) || seasonTeamIds.has(match.awayTeamId)),
    R.groupBy((match) => match.year),
    R.mapValues((matches) => matches.slice(-FORM_LENGTH).map((match) => resultOfTeam(match, seasonTeamIds))),
  )
