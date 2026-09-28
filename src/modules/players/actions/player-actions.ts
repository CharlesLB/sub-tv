'use server'

import { updateTag } from 'next/cache'
import { z } from 'zod'
import { type ActionResult, fail, ok } from '@/lib/actions/result'
import { tags } from '@/lib/cache/tags'
import { AUDIT_ACTION, AUDIT_ENTITY, type AuditAction, recordAudit } from '@/modules/audit'
import { requireUser } from '@/modules/auth'
import { AddCuriosityInput, CreateManualPlayerInput, RemoveCuriosityInput, UpdatePlayerProfileInput } from '../schemas'
import { type PlayerChange, playerService } from '../services/player-service'

const INVALID_FIELDS = 'Confira os campos.'

type PlayerResult = ActionResult<{ playerId: string }>

const auditPlayerChange = (userId: string, action: AuditAction, playerId: string, details: Record<string, unknown>) =>
  recordAudit({ userId, action, entityType: AUDIT_ENTITY.PLAYER, entityId: playerId, details })

const expirePlayerChange = (change: PlayerChange) => {
  updateTag(tags.player(change.playerId))
  change.seasonTeamIds.map((seasonTeamId) => updateTag(tags.teamSquad(seasonTeamId)))
}

export async function updatePlayerProfile(_previous: PlayerResult | null, formData: FormData): Promise<PlayerResult> {
  const user = await requireUser()

  const parsed = UpdatePlayerProfileInput.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return fail(INVALID_FIELDS, z.flattenError(parsed.error).fieldErrors)

  const result = await playerService.updateProfile(parsed.data)
  if (!result.ok) return result
  await auditPlayerChange(user.id, AUDIT_ACTION.PLAYER_PROFILE_UPDATED, result.data.playerId, { ...parsed.data })
  expirePlayerChange(result.data)

  return ok({ playerId: result.data.playerId })
}

export async function addCuriosity(_previous: PlayerResult | null, formData: FormData): Promise<PlayerResult> {
  const user = await requireUser()

  const parsed = AddCuriosityInput.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return fail(INVALID_FIELDS, z.flattenError(parsed.error).fieldErrors)

  const result = await playerService.addCuriosity(parsed.data, user.id)
  if (!result.ok) return result
  await auditPlayerChange(user.id, AUDIT_ACTION.CURIOSITY_ADDED, result.data.playerId, { ...parsed.data })
  expirePlayerChange(result.data)

  return ok({ playerId: result.data.playerId })
}

export async function removeCuriosity(_previous: PlayerResult | null, formData: FormData): Promise<PlayerResult> {
  const user = await requireUser()

  const parsed = RemoveCuriosityInput.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return fail(INVALID_FIELDS, z.flattenError(parsed.error).fieldErrors)

  const result = await playerService.removeCuriosity(parsed.data)
  if (!result.ok) return result
  await auditPlayerChange(user.id, AUDIT_ACTION.CURIOSITY_REMOVED, result.data.playerId, { ...parsed.data })
  expirePlayerChange(result.data)

  return ok({ playerId: result.data.playerId })
}

export async function createManualPlayer(_previous: PlayerResult | null, formData: FormData): Promise<PlayerResult> {
  const user = await requireUser()

  const parsed = CreateManualPlayerInput.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return fail(INVALID_FIELDS, z.flattenError(parsed.error).fieldErrors)

  const result = await playerService.createManualPlayer(parsed.data)
  if (!result.ok) return result
  await auditPlayerChange(user.id, AUDIT_ACTION.MANUAL_PLAYER_CREATED, result.data.playerId, { ...parsed.data })
  expirePlayerChange(result.data)
  updateTag(tags.seasonTeams(result.data.seasonId))

  return ok({ playerId: result.data.playerId })
}
