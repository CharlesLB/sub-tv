import { sql } from 'drizzle-orm'
import { isCountedMatch } from '../counted-match/counted-match'
import type { SqlExecutor } from '../sql-executor/sql-executor'

export const recomputeStaffStatistics = async (executor: SqlExecutor, seasonId: string): Promise<void> => {
  await executor.execute(sql`delete from staff_season_stats where season_team_id in (select id from season_teams where season_id = ${seasonId})`)

  await executor.execute(sql`
    with staff_matches as (
      select distinct
        case when staff.side = 'home' then match.home_team_id else match.away_team_id end as season_team_id,
        staff.staff_member_id,
        match.id as match_id,
        case when staff.side = 'home' then match.home_score else match.away_score end as goals_for,
        case when staff.side = 'home' then match.away_score else match.home_score end as goals_against,
        ${isCountedMatch} and match.home_score is not null and match.away_score is not null as is_decided
      from match_staff staff
      join matches match on match.id = staff.match_id
      where match.season_id = ${seasonId} and match.removed_at is null and ${isCountedMatch}
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
