import { Pool } from 'pg'

const LOCAL_DATABASE_URL = 'postgres://postgres:postgres@localhost:5432/postgres'
const MINIMUM_SQUAD_SIZE = 11

const withPool = async <TResult>(work: (pool: Pool) => Promise<TResult>): Promise<TResult> => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL ?? LOCAL_DATABASE_URL, max: 1 })

  try {
    return await work(pool)
  } finally {
    await pool.end()
  }
}

export const findSeasonWithFullSquads = (): Promise<string | null> =>
  withPool(async (pool) => {
    const result = await pool.query<{ season_id: string }>(
      `select st.season_id
         from season_teams st
         join season_squads sq on sq.season_team_id = st.id
        group by st.season_id, st.id
       having count(sq.id) >= $1`,
      [MINIMUM_SQUAD_SIZE],
    )

    const teamsBySeason = result.rows.reduce<Record<string, number>>((counts, row) => ({ ...counts, [row.season_id]: (counts[row.season_id] ?? 0) + 1 }), {})

    return Object.entries(teamsBySeason).find(([, teams]) => teams >= 2)?.[0] ?? null
  })

export const deleteCreatedMatch = (matchId: string): Promise<number> =>
  withPool(async (pool) => {
    await pool.query('delete from match_events where match_id = $1', [matchId])
    const deleted = await pool.query('delete from matches where id = $1 and fmf_match_id is null', [matchId])

    return deleted.rowCount ?? 0
  })
