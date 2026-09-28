import * as R from 'remeda'
import { FORM_LENGTH, resultFor } from '../form-result/form-result'
import { MATCH_STATUS } from '../match-status/match-status'
import type { FormResult, MatchCardVM } from '../types'

type TeamResult = { seasonTeamId: string; result: FormResult }

const teamResultsOf = (match: MatchCardVM): TeamResult[] => {
  if (match.status !== MATCH_STATUS.FINISHED || match.homeScore === null || match.awayScore === null) return []

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
