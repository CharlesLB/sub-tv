import * as R from 'remeda'
import type { FormResult, MatchCardVM } from '../types'

const FINISHED_STATUS = 'encerrado'
const FORM_LENGTH = 5

type TeamResult = { seasonTeamId: string; result: FormResult }

const resultFor = (goalsScored: number, goalsConceded: number): FormResult => {
  if (goalsScored > goalsConceded) return 'V'
  if (goalsScored < goalsConceded) return 'D'

  return 'E'
}

const teamResultsOf = (match: MatchCardVM): TeamResult[] => {
  if (match.status !== FINISHED_STATUS || match.homeScore === null || match.awayScore === null) return []

  return [
    { seasonTeamId: match.homeTeamId, result: resultFor(match.homeScore, match.awayScore) },
    { seasonTeamId: match.awayTeamId, result: resultFor(match.awayScore, match.homeScore) },
  ]
}

export const buildRecentForm = (matchesInKickoffOrder: MatchCardVM[]): Record<string, FormResult[]> =>
  R.pipe(
    matchesInKickoffOrder,
    R.flatMap(teamResultsOf),
    R.groupBy((teamResult) => teamResult.seasonTeamId),
    R.mapValues((teamResults) => teamResults.slice(-FORM_LENGTH).map((teamResult) => teamResult.result)),
  )
