import * as R from 'remeda'
import { FORM_LENGTH, type FormResult, resultFor } from '@/modules/championships/client'

export type FinishedTeamMatch = {
  year: number
  homeTeamId: string
  awayTeamId: string
  homeScore: number
  awayScore: number
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
