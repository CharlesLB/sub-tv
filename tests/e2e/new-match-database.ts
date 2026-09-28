import pg from 'pg'

const DATABASE_URL = process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/postgres'
const MINIMUM_SQUAD_SIZE = 11

export type LineupRow = { fullName: string; isStarter: boolean; pitchX: number | null; pitchY: number | null; side: string }

const withClient = async <TResult>(work: (client: pg.Client) => Promise<TResult>): Promise<TResult> => {
  const client = new pg.Client({ connectionString: DATABASE_URL })
  await client.connect()
  try {
    return await work(client)
  } finally {
    await client.end()
  }
}

export const findSeasonReadyForNewMatch = async (): Promise<string | null> =>
  withClient(async (client) => {
    const result = await client.query<{ seasonId: string }>(
      `select season_teams.season_id as "seasonId"
         from season_teams
         join season_squads on season_squads.season_team_id = season_teams.id and season_squads.is_active
        group by season_teams.season_id, season_teams.id
       having count(*) >= $1`,
      [MINIMUM_SQUAD_SIZE],
    )
    const counts = result.rows.reduce<Record<string, number>>((total, row) => ({ ...total, [row.seasonId]: (total[row.seasonId] ?? 0) + 1 }), {})

    return Object.entries(counts).find(([, readyTeams]) => readyTeams >= 2)?.[0] ?? null
  })

export const readBroadcastMatchIds = async (): Promise<string[]> =>
  withClient(async (client) => (await client.query<{ id: string }>('select id from matches where is_broadcast')).rows.map((row) => row.id))

export const readLineup = async (matchId: string): Promise<LineupRow[]> =>
  withClient(
    async (client) =>
      (
        await client.query<LineupRow>(
          `select players.full_name as "fullName", is_starter as "isStarter", pitch_x as "pitchX", pitch_y as "pitchY", side
             from match_lineups join players on players.id = match_lineups.player_id
            where match_id = $1`,
          [matchId],
        )
      ).rows,
  )

export const deleteMatchAndRestoreBroadcasts = async (matchId: string, previousBroadcastIds: string[]): Promise<void> =>
  withClient(async (client) => {
    await client.query('begin')
    await client.query('delete from match_events where match_id = $1', [matchId])
    await client.query('delete from match_lineups where match_id = $1', [matchId])
    await client.query('delete from match_teams where match_id = $1', [matchId])
    await client.query('delete from matches where id = $1', [matchId])
    await client.query('update matches set is_broadcast = true where id = any($1::uuid[])', [previousBroadcastIds])
    await client.query('commit')
  })
