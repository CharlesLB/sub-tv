'use server'

import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { fail, type ActionResult } from '@/lib/actions/result'
import { tags } from '@/lib/cache/tags'
import { AUDIT_ACTION, AUDIT_ENTITY, recordAudit } from '@/modules/audit'
import { requireUser } from '@/modules/auth'
import { routes } from '@/lib/routes'
import { CreateBroadcastMatchInput } from '../schemas'
import { matchSetupService } from '../services/match-setup-service'

export async function createBroadcastMatch(input: unknown): Promise<ActionResult<{ matchId: string }>> {
  const user = await requireUser()

  const parsed = CreateBroadcastMatchInput.safeParse(input)
  if (!parsed.success) return fail('Confira os dados da partida · Algum campo está incompleto ou inválido.', z.flattenError(parsed.error).fieldErrors)

  const result = await matchSetupService.createBroadcastMatch(parsed.data)
  if (!result.ok) return result

  const { matchId, seasonId, previousBroadcastSeasonIds } = result.data
  await recordAudit({ userId: user.id, action: AUDIT_ACTION.BROADCAST_MATCH_CREATED, entityType: AUDIT_ENTITY.MATCH, entityId: matchId, details: { ...parsed.data } })
  updateTag(tags.liveMatches())
  updateTag(tags.seasonMatches(seasonId))
  updateTag(tags.match(matchId))
  previousBroadcastSeasonIds.filter((previousSeasonId) => previousSeasonId !== seasonId).map((previousSeasonId) => updateTag(tags.seasonMatches(previousSeasonId)))

  redirect(routes.live(matchId))
}
