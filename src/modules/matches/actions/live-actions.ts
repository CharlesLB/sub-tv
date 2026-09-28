'use server'

import { updateTag } from 'next/cache'
import { z } from 'zod'
import { fail, ok, type ActionResult } from '@/lib/actions/result'
import { tags } from '@/lib/cache/tags'
import { AUDIT_ACTION, AUDIT_ENTITY, recordAudit, type AuditAction } from '@/modules/audit'
import { requireUser } from '@/modules/auth'
import {
  ApplySubstitutionInput,
  AttachAssistInput,
  RecordLiveEventInput,
  RevertLiveEventInput,
  UpdateLineupPositionInput,
  UpdateLiveClockInput,
} from '../live-schemas/live-schemas'
import { liveService } from '../services/live-service'
import type { SeasonTouch } from '../services/match-finalization/match-finalization'

const INVALID_INPUT = 'Não foi possível registrar: dados inválidos.'

const auditMatchChange = (userId: string, action: AuditAction, matchId: string, details: Record<string, unknown>) =>
  recordAudit({ userId, action, entityType: AUDIT_ENTITY.MATCH, entityId: matchId, details })

const invalidateSeason = (seasonTouch: SeasonTouch | null): void => {
  if (!seasonTouch) return
  updateTag(tags.season(seasonTouch.seasonId))
  updateTag(tags.seasonMatches(seasonTouch.seasonId))
  updateTag(tags.seasonTeams(seasonTouch.seasonId))
  updateTag(tags.history())
  updateTag(tags.teamSquad(seasonTouch.homeSeasonTeamId))
  updateTag(tags.teamSquad(seasonTouch.awaySeasonTeamId))
}

const invalid = (error: z.ZodError): ActionResult<never> => fail(INVALID_INPUT, z.flattenError(error).fieldErrors)

export async function recordLiveEvent(input: RecordLiveEventInput): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser()
  const parsed = RecordLiveEventInput.safeParse(input)
  if (!parsed.success) return invalid(parsed.error)

  const { result, seasonTouch } = await liveService.recordEvent(parsed.data, user.id)
  invalidateSeason(seasonTouch)
  if (result.ok) {
    updateTag(tags.match(parsed.data.matchId))
    await auditMatchChange(user.id, AUDIT_ACTION.LIVE_EVENT_RECORDED, parsed.data.matchId, { eventId: result.data.id, ...parsed.data })
  }

  return result
}

export async function applySubstitution(input: ApplySubstitutionInput): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser()
  const parsed = ApplySubstitutionInput.safeParse(input)
  if (!parsed.success) return invalid(parsed.error)

  const { result, seasonTouch } = await liveService.substitute(parsed.data, user.id)
  invalidateSeason(seasonTouch)
  if (result.ok) {
    updateTag(tags.match(parsed.data.matchId))
    await auditMatchChange(user.id, AUDIT_ACTION.SUBSTITUTION_APPLIED, parsed.data.matchId, { ...parsed.data })
  }

  return result
}

export async function revertLiveEvent(input: RevertLiveEventInput): Promise<ActionResult<{ id: string } | null>> {
  const user = await requireUser()
  const parsed = RevertLiveEventInput.safeParse(input)
  if (!parsed.success) return invalid(parsed.error)

  const { result, seasonTouch } = await liveService.revertEvent(parsed.data.matchId, parsed.data.eventKey)
  invalidateSeason(seasonTouch)
  if (result.ok) {
    updateTag(tags.match(parsed.data.matchId))
    await auditMatchChange(user.id, AUDIT_ACTION.LIVE_EVENT_REVERTED, parsed.data.matchId, { ...parsed.data })
  }

  return result
}

export async function attachAssist(input: AttachAssistInput): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser()
  const parsed = AttachAssistInput.safeParse(input)
  if (!parsed.success) return invalid(parsed.error)

  const result = await liveService.attachAssist(parsed.data.matchId, parsed.data.goalKey, parsed.data.assistPlayerId)
  if (result.ok) {
    updateTag(tags.match(parsed.data.matchId))
    await auditMatchChange(user.id, AUDIT_ACTION.ASSIST_ATTACHED, parsed.data.matchId, { ...parsed.data })
  }

  return result
}

export async function updateLiveClock(input: UpdateLiveClockInput): Promise<ActionResult<{ statusChanged: boolean }>> {
  const user = await requireUser()
  const parsed = UpdateLiveClockInput.safeParse(input)
  if (!parsed.success) return invalid(parsed.error)

  const result = await liveService.updateClock(parsed.data.matchId, parsed.data.clock)
  if (!result.ok) return result

  await auditMatchChange(user.id, AUDIT_ACTION.LIVE_CLOCK_UPDATED, parsed.data.matchId, { clock: parsed.data.clock, statusChanged: result.data.statusChanged })
  updateTag(tags.match(parsed.data.matchId))
  invalidateSeason(result.data.seasonTouch)
  if (result.data.statusChanged) {
    updateTag(tags.liveMatches())
    updateTag(tags.seasonMatches(result.data.seasonId))
  }

  return ok({ statusChanged: result.data.statusChanged })
}

export async function updateLineupPosition(input: UpdateLineupPositionInput): Promise<ActionResult<{ playerId: string }>> {
  const user = await requireUser()
  const parsed = UpdateLineupPositionInput.safeParse(input)
  if (!parsed.success) return invalid(parsed.error)

  const result = await liveService.updatePosition(parsed.data.matchId, parsed.data.playerId, parsed.data.pitchX, parsed.data.pitchY)
  if (result.ok) {
    updateTag(tags.match(parsed.data.matchId))
    await auditMatchChange(user.id, AUDIT_ACTION.LINEUP_POSITION_UPDATED, parsed.data.matchId, { ...parsed.data })
  }

  return result
}
