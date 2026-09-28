import { and, eq, sql } from 'drizzle-orm'
import { fmfTopScorers, playerSeasonStats } from '../../../../src/lib/db/schema'
import { type ImportIssue, SYNC_ISSUE, type Transaction, createIssue } from '../../database-loader/database-context/database-context'

export const compareTopScorers = async (transaction: Transaction, seasonId: string): Promise<ImportIssue[]> => {
  const rows = await transaction
    .select({
      playerId: fmfTopScorers.playerId,
      fullName: fmfTopScorers.fullName,
      clubName: fmfTopScorers.clubName,
      fmfGoals: fmfTopScorers.goals,
      computedGoals: sql<number>`coalesce((select sum(${playerSeasonStats.goals}) from ${playerSeasonStats} where ${and(eq(playerSeasonStats.seasonId, seasonId), eq(playerSeasonStats.playerId, fmfTopScorers.playerId))}), 0)::int`,
    })
    .from(fmfTopScorers)
    .where(eq(fmfTopScorers.seasonId, seasonId))

  return rows
    .filter((row) => row.playerId === null || row.computedGoals !== row.fmfGoals)
    .map((row) =>
      createIssue(
        SYNC_ISSUE.ARTILHARIA_DIVERGENTE,
        { nome: row.fullName, clube: row.clubName, golsFmf: row.fmfGoals, golsCalculados: row.playerId === null ? null : row.computedGoals, jogadorCasado: row.playerId !== null },
        row.playerId ? { playerId: row.playerId } : {},
      ),
    )
}
