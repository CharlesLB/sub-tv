import { sql } from 'drizzle-orm'
import { isCountedMatch } from '../counted-match/counted-match'
import type { SqlExecutor } from '../sql-executor/sql-executor'

export const recomputePlayerStatistics = async (executor: SqlExecutor, seasonId: string): Promise<void> => {
  await executor.execute(sql`delete from player_season_stats where season_id = ${seasonId}`)

  await executor.execute(sql`
    with active_events as (
      select event.*
      from match_events event
      join matches match on match.id = event.match_id
      where match.season_id = ${seasonId} and ${isCountedMatch} and event.deleted_at is null and event.superseded_at is null
    ),
    player_events as (
      select
        event.match_id,
        event.player_id,
        count(*) filter (where event.type = 'substituicao') as sub_in,
        count(*) filter (where event.type = 'gol' and event.goal_type <> 'contra' and event.period <> 'PEN') as goals,
        count(*) filter (where event.type = 'gol' and event.goal_type = 'penalti' and event.period <> 'PEN') as penalty_goals,
        count(*) filter (where event.type = 'gol' and event.goal_type = 'contra') as own_goals,
        count(*) filter (where event.type = 'amarelo') as yellow_cards,
        count(*) filter (where event.type = 'vermelho') as red_cards
      from active_events event
      where event.player_id is not null
      group by event.match_id, event.player_id
    ),
    substituted_out as (
      select event.match_id, event.player_out_id as player_id, count(*) as sub_out
      from active_events event
      where event.type = 'substituicao' and event.player_out_id is not null
      group by event.match_id, event.player_out_id
    ),
    assisted as (
      select event.match_id, event.assist_player_id as player_id, count(*) as assists
      from active_events event
      where event.type = 'gol' and event.assist_player_id is not null
      group by event.match_id, event.assist_player_id
    ),
    appearances as (
      select
        match.season_id,
        lineup.player_id,
        case when lineup.side = 'home' then match.home_team_id else match.away_team_id end as season_team_id,
        lineup.is_starter,
        coalesce(player_event.sub_in, 0) as sub_in,
        coalesce(substitution.sub_out, 0) as sub_out,
        coalesce(player_event.goals, 0) as goals,
        coalesce(player_event.penalty_goals, 0) as penalty_goals,
        coalesce(player_event.own_goals, 0) as own_goals,
        coalesce(assist.assists, 0) as assists,
        coalesce(player_event.yellow_cards, 0) as yellow_cards,
        coalesce(player_event.red_cards, 0) as red_cards
      from match_lineups lineup
      join matches match on match.id = lineup.match_id
      left join player_events player_event on player_event.match_id = lineup.match_id and player_event.player_id = lineup.player_id
      left join substituted_out substitution on substitution.match_id = lineup.match_id and substitution.player_id = lineup.player_id
      left join assisted assist on assist.match_id = lineup.match_id and assist.player_id = lineup.player_id
      where match.season_id = ${seasonId} and match.removed_at is null and ${isCountedMatch}
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
