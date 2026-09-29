import { Pool } from 'pg'
import * as R from 'remeda'
import { DATABASE_URL } from '../credentials/credentials'

const MINIMUM_SQUAD_SIZE = 11
const USERNAME_LOCALE = 'pt-BR'

export type LineupRow = { fullName: string; isStarter: boolean; pitchX: number | null; pitchY: number | null; side: string }
export type PlayerProfile = { displayName: string | null; position: string | null; preferredFoot: string | null }
export type ScheduledMatch = { seasonId: string; matchId: string; round: number | null }

const withPool = async <TResult>(work: (pool: Pool) => Promise<TResult>): Promise<TResult> => {
  const pool = new Pool({ connectionString: DATABASE_URL, max: 1 })

  try {
    return await work(pool)
  } finally {
    await pool.end()
  }
}

const READY_TEAMS_QUERY = `
  select season_teams.season_id as "seasonId", season_teams.id as "seasonTeamId"
    from season_teams
    join season_squads on season_squads.season_team_id = season_teams.id and season_squads.is_active
   group by season_teams.season_id, season_teams.id
  having count(*) >= $1`

export const findSeasonReadyForNewMatch = (): Promise<string | null> =>
  withPool(async (pool) => {
    const result = await pool.query<{ seasonId: string }>(READY_TEAMS_QUERY, [MINIMUM_SQUAD_SIZE])
    const readyTeamsBySeason = R.countBy(result.rows, (row) => row.seasonId)

    return Object.entries(readyTeamsBySeason).find(([, readyTeams]) => readyTeams >= 2)?.[0] ?? null
  })

export const findScheduledMatchReadyForBroadcast = (): Promise<ScheduledMatch | null> =>
  withPool(async (pool) => {
    const result = await pool.query<ScheduledMatch>(
      `with ready as (${READY_TEAMS_QUERY})
       select matches.season_id as "seasonId", matches.id as "matchId", matches.round as "round"
         from matches
        where matches.status = 'agendado'
          and matches.removed_at is null
          and matches.home_team_id in (select "seasonTeamId" from ready)
          and matches.away_team_id in (select "seasonTeamId" from ready)
        limit 1`,
      [MINIMUM_SQUAD_SIZE],
    )

    return result.rows[0] ?? null
  })

export const readBroadcastMatchIds = (): Promise<string[]> => withPool(async (pool) => (await pool.query<{ id: string }>('select id from matches where is_broadcast')).rows.map((row) => row.id))

export const readMatchStatus = (matchId: string): Promise<{ isBroadcast: boolean } | null> =>
  withPool(async (pool) => (await pool.query<{ isBroadcast: boolean }>('select is_broadcast as "isBroadcast" from matches where id = $1', [matchId])).rows[0] ?? null)

export const readLineup = (matchId: string): Promise<LineupRow[]> =>
  withPool(
    async (pool) =>
      (
        await pool.query<LineupRow>(
          `select players.full_name as "fullName", is_starter as "isStarter", pitch_x as "pitchX", pitch_y as "pitchY", side
             from match_lineups join players on players.id = match_lineups.player_id
            where match_id = $1`,
          [matchId],
        )
      ).rows,
  )

export const countActiveEventsOf = (matchId: string, eventType: string): Promise<number> =>
  withPool(async (pool) => {
    const result = await pool.query<{ total: string }>('select count(*) as total from match_events where match_id = $1 and type = $2 and deleted_at is null', [matchId, eventType])

    return Number(result.rows[0]?.total ?? 0)
  })

export const deleteMatchAndRestoreBroadcasts = (matchId: string, previousBroadcastIds: string[]): Promise<void> =>
  withPool(async (pool) => {
    await pool.query('begin')
    await pool.query('delete from matches where id = $1 and fmf_match_id is null', [matchId])
    await pool.query('update matches set is_broadcast = true where id = any($1::uuid[])', [previousBroadcastIds])
    await pool.query('commit')
  })

export const deleteChampionshipsNamed = (name: string): Promise<number> =>
  withPool(async (pool) => {
    const deleted = await pool.query<{ competition_id: string }>('delete from seasons where label = $1 and fmf_competition_id is null returning competition_id', [name])
    const competitionIds = deleted.rows.map((row) => row.competition_id)
    await pool.query('delete from competitions c where c.id = any($1::uuid[]) and not exists (select 1 from seasons s where s.competition_id = c.id)', [competitionIds])

    return deleted.rowCount ?? 0
  })

export const countSquadMembersOf = (seasonId: string): Promise<number> =>
  withPool(async (pool) => {
    const result = await pool.query<{ total: string }>('select count(*) as total from season_squads sq join season_teams st on st.id = sq.season_team_id where st.season_id = $1', [seasonId])

    return Number(result.rows[0]?.total ?? 0)
  })

export const deleteCuriositiesStartingWith = (prefix: string): Promise<number> =>
  withPool(async (pool) => (await pool.query('delete from curiosities where text like $1', [`${prefix}%`])).rowCount ?? 0)

export const readPlayerProfile = (playerId: string): Promise<PlayerProfile | null> =>
  withPool(
    async (pool) => (await pool.query<PlayerProfile>('select display_name as "displayName", position, preferred_foot as "preferredFoot" from players where id = $1', [playerId])).rows[0] ?? null,
  )

export const restorePlayerProfile = (playerId: string, profile: PlayerProfile): Promise<void> =>
  withPool(async (pool) => {
    await pool.query('update players set display_name = $2, position = $3, preferred_foot = $4 where id = $1', [playerId, profile.displayName, profile.position, profile.preferredFoot])
  })

export const deleteManualPlayersStartingWith = (namePrefix: string): Promise<number> =>
  withPool(async (pool) => {
    const found = await pool.query<{ id: string }>('select id from players where full_name like $1 and cbf_id is null', [`${namePrefix}%`])
    const playerIds = found.rows.map((row) => row.id)
    await pool.query('delete from season_squads where player_id = any($1::uuid[])', [playerIds])
    const deleted = await pool.query('delete from players where id = any($1::uuid[])', [playerIds])

    return deleted.rowCount ?? 0
  })

export const deleteUserAndAuditRows = (username: string): Promise<number> =>
  withPool(async (pool) => {
    const normalizedUsername = username.trim().replace(/\s+/g, ' ').toLocaleLowerCase(USERNAME_LOCALE)
    const users = await pool.query<{ id: string }>('select id from app_users where normalized_username = $1', [normalizedUsername])
    const userIds = users.rows.map((row) => row.id)
    await pool.query('delete from audit_log where user_id = any($1::uuid[]) or entity_id = any($1::text[])', [userIds])
    const deleted = await pool.query('delete from app_users where id = any($1::uuid[])', [userIds])

    return deleted.rowCount ?? 0
  })
