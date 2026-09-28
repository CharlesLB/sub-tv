import { type SQL, sql } from 'drizzle-orm'

export type SqlExecutor = { execute: (query: SQL) => Promise<unknown> }

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

export const resolveNarratedScore = (match: { sumulaProcessedAt: Date | null }, events: ScoredEvent[]): FinalScore | null => {
  if (match.sumulaProcessedAt !== null) return null
  if (!events.some((event) => isActiveEvent(event) && event.source !== FMF_SOURCE)) return null

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
      and exists (select 1 from match_events event where event.match_id = match.id and event.source <> 'fmf' and event.deleted_at is null and event.superseded_at is null)
  `)
}

const recomputePlayerStatistics = async (executor: SqlExecutor, seasonId: string): Promise<void> => {
  await executor.execute(sql`delete from player_season_stats where season_id = ${seasonId}`)

  await executor.execute(sql`
    with active_events as (
      select event.*
      from match_events event
      join matches match on match.id = event.match_id
      where match.season_id = ${seasonId} and event.deleted_at is null and event.superseded_at is null
    ),
    appearances as (
      select
        match.season_id,
        lineup.player_id,
        case when lineup.side = 'home' then match.home_team_id else match.away_team_id end as season_team_id,
        lineup.is_starter,
        (select count(*) from active_events event where event.match_id = lineup.match_id and event.type = 'substituicao' and event.player_id = lineup.player_id) as sub_in,
        (select count(*) from active_events event where event.match_id = lineup.match_id and event.type = 'substituicao' and event.player_out_id = lineup.player_id) as sub_out,
        (select count(*) from active_events event where event.match_id = lineup.match_id and event.type = 'gol' and event.player_id = lineup.player_id and event.goal_type <> 'contra' and event.period <> 'PEN') as goals,
        (select count(*) from active_events event where event.match_id = lineup.match_id and event.type = 'gol' and event.player_id = lineup.player_id and event.goal_type = 'penalti' and event.period <> 'PEN') as penalty_goals,
        (select count(*) from active_events event where event.match_id = lineup.match_id and event.type = 'gol' and event.player_id = lineup.player_id and event.goal_type = 'contra') as own_goals,
        (select count(*) from active_events event where event.match_id = lineup.match_id and event.type = 'gol' and event.assist_player_id = lineup.player_id) as assists,
        (select count(*) from active_events event where event.match_id = lineup.match_id and event.type = 'amarelo' and event.player_id = lineup.player_id) as yellow_cards,
        (select count(*) from active_events event where event.match_id = lineup.match_id and event.type = 'vermelho' and event.player_id = lineup.player_id) as red_cards
      from match_lineups lineup
      join matches match on match.id = lineup.match_id
      where match.season_id = ${seasonId} and match.removed_at is null
    )
    insert into player_season_stats (season_id, player_id, season_team_id, games, starts, sub_in, sub_out, goals, penalty_goals, own_goals, assists, yellow_cards, red_cards)
    select
      season_id,
      player_id,
      season_team_id,
      count(*) filter (where is_starter or sub_in > 0),
      count(*) filter (where is_starter),
      sum(sub_in),
      sum(sub_out),
      sum(goals),
      sum(penalty_goals),
      sum(own_goals),
      sum(assists),
      sum(yellow_cards),
      sum(red_cards)
    from appearances
    group by season_id, player_id, season_team_id
  `)

  await executor.execute(sql`
    update player_season_stats stats
    set rank_in_team_goals = ranked.position
    from (
      select player_id, season_team_id, dense_rank() over (partition by season_team_id order by goals desc) as position
      from player_season_stats
      where season_id = ${seasonId} and goals > 0
    ) ranked
    where stats.season_id = ${seasonId} and stats.player_id = ranked.player_id and stats.season_team_id = ranked.season_team_id
  `)
}

const recomputeTeamStatistics = async (executor: SqlExecutor, seasonId: string): Promise<void> => {
  await executor.execute(sql`delete from team_season_stats where season_team_id in (select id from season_teams where season_id = ${seasonId})`)

  await executor.execute(sql`
    with team_matches as (
      select
        team.id as season_team_id,
        match.id as match_id,
        case when match.home_team_id = team.id then 'home' else 'away' end as side,
        case when match.home_team_id = team.id then match.home_score else match.away_score end as goals_for,
        case when match.home_team_id = team.id then match.away_score else match.home_score end as goals_against,
        match.status in ('encerrado', 'wo') and match.home_score is not null and match.away_score is not null as is_decided
      from season_teams team
      join matches match on match.season_id = team.season_id and team.id in (match.home_team_id, match.away_team_id)
      where team.season_id = ${seasonId} and match.removed_at is null
    ),
    cards as (
      select
        team_match.season_team_id,
        count(*) filter (where event.type = 'amarelo') as yellow_cards,
        count(*) filter (where event.type = 'vermelho') as red_cards
      from team_matches team_match
      join match_events event on event.match_id = team_match.match_id and event.side::text = team_match.side
      where event.deleted_at is null and event.superseded_at is null
      group by team_match.season_team_id
    ),
    results as (
      select
        season_team_id,
        count(*) filter (where is_decided) as played,
        count(*) filter (where is_decided and goals_for > goals_against) as wins,
        count(*) filter (where is_decided and goals_for = goals_against) as draws,
        count(*) filter (where is_decided and goals_for < goals_against) as losses,
        coalesce(sum(goals_for) filter (where is_decided), 0) as goals_for,
        coalesce(sum(goals_against) filter (where is_decided), 0) as goals_against,
        count(*) filter (where is_decided and goals_against = 0) as clean_sheets
      from team_matches
      group by season_team_id
    )
    insert into team_season_stats (season_team_id, played, wins, draws, losses, goals_for, goals_against, points, yellow_cards, red_cards, clean_sheets)
    select
      team.id,
      coalesce(results.played, 0),
      coalesce(results.wins, 0),
      coalesce(results.draws, 0),
      coalesce(results.losses, 0),
      coalesce(results.goals_for, 0),
      coalesce(results.goals_against, 0),
      coalesce(results.wins * 3 + results.draws, 0),
      coalesce(cards.yellow_cards, 0),
      coalesce(cards.red_cards, 0),
      coalesce(results.clean_sheets, 0)
    from season_teams team
    left join results on results.season_team_id = team.id
    left join cards on cards.season_team_id = team.id
    where team.season_id = ${seasonId}
  `)
}

const recomputeStaffStatistics = async (executor: SqlExecutor, seasonId: string): Promise<void> => {
  await executor.execute(sql`delete from staff_season_stats where season_team_id in (select id from season_teams where season_id = ${seasonId})`)

  await executor.execute(sql`
    with staff_matches as (
      select distinct
        case when staff.side = 'home' then match.home_team_id else match.away_team_id end as season_team_id,
        staff.staff_member_id,
        match.id as match_id,
        case when staff.side = 'home' then match.home_score else match.away_score end as goals_for,
        case when staff.side = 'home' then match.away_score else match.home_score end as goals_against,
        match.status in ('encerrado', 'wo') and match.home_score is not null and match.away_score is not null as is_decided
      from match_staff staff
      join matches match on match.id = staff.match_id
      where match.season_id = ${seasonId} and match.removed_at is null
    )
    insert into staff_season_stats (season_team_id, staff_member_id, games, wins, draws, losses, yellow_cards, red_cards)
    select
      staff_match.season_team_id,
      staff_match.staff_member_id,
      count(*),
      count(*) filter (where is_decided and goals_for > goals_against),
      count(*) filter (where is_decided and goals_for = goals_against),
      count(*) filter (where is_decided and goals_for < goals_against),
      coalesce(sum((select count(*) from match_events event where event.match_id = staff_match.match_id and event.staff_member_id = staff_match.staff_member_id and event.type = 'amarelo' and event.deleted_at is null and event.superseded_at is null)), 0),
      coalesce(sum((select count(*) from match_events event where event.match_id = staff_match.match_id and event.staff_member_id = staff_match.staff_member_id and event.type = 'vermelho' and event.deleted_at is null and event.superseded_at is null)), 0)
    from staff_matches staff_match
    group by staff_match.season_team_id, staff_match.staff_member_id
  `)
}

export const recomputeSeasonStatistics = async (executor: SqlExecutor, seasonId: string): Promise<void> => {
  await deriveNarratedScores(executor, seasonId)
  await recomputePlayerStatistics(executor, seasonId)
  await recomputeTeamStatistics(executor, seasonId)
  await recomputeStaffStatistics(executor, seasonId)
}
