import { sql } from 'drizzle-orm'
import { isCountedMatch } from '../counted-match/counted-match'
import type { SqlExecutor } from '../sql-executor/sql-executor'

export const recomputeTeamStatistics = async (executor: SqlExecutor, seasonId: string): Promise<void> => {
  await executor.execute(sql`delete from team_season_stats where season_team_id in (select id from season_teams where season_id = ${seasonId})`)

  await executor.execute(sql`
    with team_matches as (
      select
        team.id as season_team_id,
        match.id as match_id,
        case when match.home_team_id = team.id then 'home' else 'away' end as side,
        case when match.home_team_id = team.id then match.home_score else match.away_score end as goals_for,
        case when match.home_team_id = team.id then match.away_score else match.home_score end as goals_against,
        ${isCountedMatch} as is_counted,
        ${isCountedMatch} and match.home_score is not null and match.away_score is not null as is_decided
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
      where team_match.is_counted and event.deleted_at is null and event.superseded_at is null
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
