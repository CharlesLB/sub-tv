'use server'

import { updateTag } from 'next/cache'
import { tags } from '@/lib/cache/tags'
import { isUuid } from '@/lib/utils/is-uuid/is-uuid'
import { AUDIT_ACTION, AUDIT_ENTITY, recordAudit } from '@/modules/audit'
import { requireUser } from '@/modules/auth'
import { broadcastService } from '../services/broadcast-service'

export async function closeBroadcast(matchId: string): Promise<void> {
  const user = await requireUser()
  if (!isUuid(matchId)) return

  const match = await broadcastService.close(matchId)
  if (!match) return

  await recordAudit({ userId: user.id, action: AUDIT_ACTION.BROADCAST_CLOSED, entityType: AUDIT_ENTITY.MATCH, entityId: matchId })
  updateTag(tags.liveMatches())
  updateTag(tags.match(matchId))
  updateTag(tags.seasonMatches(match.seasonId))
}
