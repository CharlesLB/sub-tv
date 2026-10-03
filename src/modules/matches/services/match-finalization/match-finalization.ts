import 'server-only'
import { eq } from 'drizzle-orm'
import { db, tables } from '@/lib/db'
import { MATCH_STATUS } from '@/modules/championships'
import { resolveNarratedScore } from '../season-statistics/season-statistics'
import { recalculateSeasonStatistics } from '../season-statistics/season-statistics.server'

export type SeasonTouch = { seasonId: string; homeSeasonTeamId: string; awaySeasonTeamId: string }

const seasonTouchOf = (match: SeasonTouch): SeasonTouch => ({ seasonId: match.seasonId, homeSeasonTeamId: match.homeSeasonTeamId, awaySeasonTeamId: match.awaySeasonTeamId })

export const refreshReopenedMatch = async (matchId: string): Promise<SeasonTouch | null> => {
  const { matches } = tables
  const [match] = await db.select({ seasonId: matches.seasonId, homeSeasonTeamId: matches.homeTeamId, awaySeasonTeamId: matches.awayTeamId }).from(matches).where(eq(matches.id, matchId)).limit(1)
  if (!match) return null

  await recalculateSeasonStatistics(match.seasonId)

  return seasonTouchOf(match)
}

export const finalizeFinishedMatch = async (matchId: string): Promise<SeasonTouch | null> => {
  const { matches, matchEvents } = tables

  const [match] = await db
    .select({
      seasonId: matches.seasonId,
      status: matches.status,
      homeSeasonTeamId: matches.homeTeamId,
      awaySeasonTeamId: matches.awayTeamId,
      sumulaProcessedAt: matches.sumulaProcessedAt,
      fmfMatchId: matches.fmfMatchId,
    })
    .from(matches)
    .where(eq(matches.id, matchId))
    .limit(1)

  if (!match || match.status !== MATCH_STATUS.FINISHED) return null

  const events = await db
    .select({
      type: matchEvents.type,
      side: matchEvents.side,
      period: matchEvents.period,
      source: matchEvents.source,
      deletedAt: matchEvents.deletedAt,
      supersededAt: matchEvents.supersededAt,
    })
    .from(matchEvents)
    .where(eq(matchEvents.matchId, matchId))

  const score = resolveNarratedScore(match, events)
  if (score) await db.update(matches).set({ homeScore: score.homeScore, awayScore: score.awayScore }).where(eq(matches.id, matchId))
  await recalculateSeasonStatistics(match.seasonId)

  return seasonTouchOf(match)
}
