'use server'

import { refresh } from 'next/cache'
import { z } from 'zod'
import { type ActionResult, fail, ok } from '@/lib/actions/result'
import { AUDIT_ACTION, AUDIT_ENTITY, recordAudit } from '@/modules/audit'
import { CreateUserInput, ResetPasswordInput, SetUserActiveInput } from '../schemas'
import { requireUser } from '../services/current-user'
import { userAdminService } from '../services/user-admin-service'

const INVALID_FIELDS = 'Confira os campos.'

export async function createUser(_previous: ActionResult<{ username: string }> | null, formData: FormData): Promise<ActionResult<{ username: string }>> {
  const user = await requireUser()
  const parsed = CreateUserInput.safeParse({ username: formData.get('username'), password: formData.get('password'), confirmation: formData.get('confirmation') })
  if (!parsed.success) return fail(INVALID_FIELDS, z.flattenError(parsed.error).fieldErrors)

  const result = await userAdminService.create(parsed.data)
  if (!result.ok) return result

  await recordAudit({ userId: user.id, action: AUDIT_ACTION.USER_CREATED, entityType: AUDIT_ENTITY.USER, entityId: result.data.id, details: { username: result.data.username } })
  refresh()

  return ok({ username: result.data.username })
}

export async function resetUserPassword(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = ResetPasswordInput.safeParse({ userId: formData.get('userId'), password: formData.get('password'), confirmation: formData.get('confirmation') })
  if (!parsed.success) return fail(INVALID_FIELDS, z.flattenError(parsed.error).fieldErrors)

  const result = await userAdminService.resetPassword(parsed.data)
  if (!result.ok) return result

  await recordAudit({ userId: user.id, action: AUDIT_ACTION.USER_PASSWORD_RESET, entityType: AUDIT_ENTITY.USER, entityId: result.data.id })
  refresh()

  return ok(undefined)
}

export async function setUserActive(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = SetUserActiveInput.safeParse({ userId: formData.get('userId'), isActive: formData.get('isActive') })
  if (!parsed.success) return fail(INVALID_FIELDS)

  const result = await userAdminService.setActive({ actorId: user.id, ...parsed.data })
  if (!result.ok) return result

  await recordAudit({
    userId: user.id,
    action: parsed.data.isActive ? AUDIT_ACTION.USER_ACTIVATED : AUDIT_ACTION.USER_DEACTIVATED,
    entityType: AUDIT_ENTITY.USER,
    entityId: result.data.id,
  })

  refresh()

  return ok(undefined)
}
