import * as R from 'remeda'
import type { LiveMatchSummaryVM, MatchCardVM, UpcomingMatchVM } from '../../types'
import { toPhaseLabel } from '../mappers/mappers'
import { MATCH_STATUS, type MatchStatus } from '../match-status/match-status'

const PENDING_STATUSES: ReadonlySet<MatchStatus> = new Set([MATCH_STATUS.SCHEDULED, MATCH_STATUS.LIVE, MATCH_STATUS.POSTPONED])

export type SeasonSummary = {
  currentRound: number | null
  currentPhase: string | null
  nextMatch: UpcomingMatchVM | null
  liveMatch: LiveMatchSummaryVM | null
  isFinished: boolean
  lastActivityAt: string | null
}

const toLiveSummary = (match: MatchCardVM): LiveMatchSummaryVM => ({
  matchId: match.id,
  home: match.home,
  away: match.away,
  homeScore: match.homeScore ?? 0,
  awayScore: match.awayScore ?? 0,
})

export const summarizeSeasonMatches = (matches: MatchCardVM[]): SeasonSummary => {
  const finishedMatches = matches.filter((match) => match.status === MATCH_STATUS.FINISHED)
  const lastFinished = R.last(finishedMatches)
  const nextScheduled = matches.find((match) => PENDING_STATUSES.has(match.status) && match.status !== MATCH_STATUS.LIVE)
  const liveMatch = matches.find((match) => match.status === MATCH_STATUS.LIVE && match.isBroadcast) ?? null
  const referenceMatch = liveMatch ?? lastFinished ?? nextScheduled ?? null

  return {
    currentRound: referenceMatch?.round ?? null,
    currentPhase: referenceMatch?.phase ?? null,
    nextMatch: nextScheduled ? { kickoffAt: nextScheduled.kickoffAt, round: nextScheduled.round } : null,
    liveMatch: liveMatch ? toLiveSummary(liveMatch) : null,
    isFinished: matches.length > 0 && !matches.some((match) => PENDING_STATUSES.has(match.status)),
    lastActivityAt: lastFinished?.kickoffAt ?? matches[0]?.kickoffAt ?? null,
  }
}

export const describeSeasonStatus = (year: number, summary: SeasonSummary): string => {
  const phaseLabel = toPhaseLabel(summary.currentPhase)
  if (summary.isFinished) return [year, 'Encerrado', phaseLabel].join(' · ')
  if (summary.currentRound === null) return [year, phaseLabel].join(' · ')

  return [year, phaseLabel, `rodada ${summary.currentRound}`].join(' · ')
}
