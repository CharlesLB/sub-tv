import { sql } from 'drizzle-orm'
import { MATCH_STATUS } from '../../../championships/lib/match-status/match-status'

export const isCountedMatch = sql`match.status in (${MATCH_STATUS.FINISHED}, ${MATCH_STATUS.WALKOVER})`
