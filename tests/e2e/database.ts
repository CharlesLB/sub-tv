import { Pool } from 'pg'

const LOCAL_DATABASE_URL = 'postgres://postgres:postgres@localhost:5432/postgres'

const createPool = () => new Pool({ connectionString: process.env.DATABASE_URL ?? LOCAL_DATABASE_URL, max: 1 })

export const deleteChampionshipsNamed = async (name: string): Promise<number> => {
  const pool = createPool()
  try {
    const deleted = await pool.query<{ competition_id: string }>('delete from seasons where label = $1 and fmf_competition_id is null returning competition_id', [name])
    const competitionIds = deleted.rows.map((row) => row.competition_id)
    await pool.query('delete from competitions c where c.id = any($1::uuid[]) and not exists (select 1 from seasons s where s.competition_id = c.id)', [competitionIds])

    return deleted.rowCount ?? 0
  } finally {
    await pool.end()
  }
}

export const countSquadMembersOf = async (seasonId: string): Promise<number> => {
  const pool = createPool()
  try {
    const result = await pool.query<{ total: string }>(
      'select count(*) as total from season_squads sq join season_teams st on st.id = sq.season_team_id where st.season_id = $1',
      [seasonId],
    )

    return Number(result.rows[0]?.total ?? 0)
  } finally {
    await pool.end()
  }
}

export const deleteCuriositiesStartingWith = async (prefix: string): Promise<number> => {
  const pool = createPool()
  const result = await pool.query('delete from curiosities where text like $1', [`${prefix}%`])
  await pool.end()

  return result.rowCount ?? 0
}
