import { sql } from 'drizzle-orm'
import { recomputePlayerStatistics } from '../player-statistics/player-statistics'
import type { SqlExecutor } from '../sql-executor/sql-executor'
import { recomputeStaffStatistics } from '../staff-statistics/staff-statistics'
import { recomputeTeamStatistics } from '../team-statistics/team-statistics'

export type ScoredEvent = {
  type: string
  side: 'home' | 'away'
  period: string
  source: string
  deletedAt: Date | null
  supersededAt: Date | null
}

export type FinalScore = { homeScore: number; awayScore: number }

const GOAL_EVENT_TYPE = 'gol'
const SHOOTOUT_PERIOD = 'PEN'
const FMF_SOURCE = 'fmf'

export const isActiveEvent = (event: Pick<ScoredEvent, 'deletedAt' | 'supersededAt'>): boolean => event.deletedAt === null && event.supersededAt === null

export const countGoalsBySide = (events: ScoredEvent[]): FinalScore => {
  const goals = events.filter((event) => isActiveEvent(event) && event.type === GOAL_EVENT_TYPE && event.period !== SHOOTOUT_PERIOD)

  return { homeScore: goals.filter((goal) => goal.side === 'home').length, awayScore: goals.filter((goal) => goal.side === 'away').length }
}

export const resolveNarratedScore = (match: { sumulaProcessedAt: Date | null; fmfMatchId: number | null }, events: ScoredEvent[]): FinalScore | null => {
  if (match.sumulaProcessedAt !== null) return null
  const isCreatedInTheTool = match.fmfMatchId === null
  if (!isCreatedInTheTool && !events.some((event) => isActiveEvent(event) && event.source !== FMF_SOURCE)) return null

  return countGoalsBySide(events)
}

const deriveNarratedScores = async (executor: SqlExecutor, seasonId: string): Promise<void> => {
  await executor.execute(sql`
    update matches match
    set
      home_score = (select count(*) from match_events event where event.match_id = match.id and event.type = 'gol' and event.side = 'home' and event.period <> 'PEN' and event.deleted_at is null and event.superseded_at is null),
      away_score = (select count(*) from match_events event where event.match_id = match.id and event.type = 'gol' and event.side = 'away' and event.period <> 'PEN' and event.deleted_at is null and event.superseded_at is null),
      updated_at = now()
    where match.season_id = ${seasonId}
      and match.sumula_processed_at is null
      and match.status in ('ao_vivo', 'encerrado')
      and (
        match.fmf_match_id is null
        or exists (select 1 from match_events event where event.match_id = match.id and event.source <> 'fmf' and event.deleted_at is null and event.superseded_at is null)
      )
  `)
}

export const recomputeSeasonStatistics = async (executor: SqlExecutor, seasonId: string): Promise<void> => {
  await deriveNarratedScores(executor, seasonId)
  await recomputePlayerStatistics(executor, seasonId)
  await recomputeTeamStatistics(executor, seasonId)
  await recomputeStaffStatistics(executor, seasonId)
}
