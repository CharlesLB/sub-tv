import { recomputeSeasonStatistics } from '../../../../src/modules/matches/services/season-statistics/season-statistics'
import type { Transaction } from '../../database-loader/database-context/database-context'

export const recalculateImportedSeason = async (transaction: Transaction, seasonId: string): Promise<void> => await recomputeSeasonStatistics(transaction, seasonId)
