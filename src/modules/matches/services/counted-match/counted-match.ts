import { sql } from 'drizzle-orm'
import { MATCH_STATUS } from '../../live-match/live-match'

export const isCountedMatch = sql`match.status in (${MATCH_STATUS.FINISHED}, ${MATCH_STATUS.WALKOVER})`
