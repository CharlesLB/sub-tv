'use server'

import { updateTag } from 'next/cache'
import { z } from 'zod'
import { fail, ok, type ActionResult } from '@/lib/actions/result'
import { tags } from '@/lib/cache/tags'
import { AUDIT_ACTION, AUDIT_ENTITY, recordAudit } from '@/modules/audit'
import { requireUser } from '@/modules/auth'
import { CreateChampionshipInput } from '../schemas'
import { championshipService } from '../services/championship-service'

const INVALID_FIELDS = 'Confira os campos.'
const CLUB_FIELD = 'clubId'

export type CreateChampionshipResult = ActionResult<{ seasonId: string }>

const readText = (formData: FormData, name: string): string | undefined => {
  const value = formData.get(name)

  return typeof value === 'string' ? value : undefined
}

export async function createChampionship(_previous: CreateChampionshipResult | null, formData: FormData): Promise<CreateChampionshipResult> {
  const user = await requireUser()

  const parsed = CreateChampionshipInput.safeParse({
    name: readText(formData, 'name'),
    category: readText(formData, 'category'),
    year: readText(formData, 'year'),
    phase: readText(formData, 'phase'),
    clubIds: formData.getAll(CLUB_FIELD).filter((value) => typeof value === 'string'),
  })
  if (!parsed.success) return fail(INVALID_FIELDS, z.flattenError(parsed.error).fieldErrors)

  const result = await championshipService.create(parsed.data)
  if (!result.ok) return result
  await recordAudit({
    userId: user.id,
    action: AUDIT_ACTION.CHAMPIONSHIP_CREATED,
    entityType: AUDIT_ENTITY.CHAMPIONSHIP,
    entityId: result.data.seasonId,
    details: { ...parsed.data, slug: result.data.slug, competitionId: result.data.competitionId },
  })
  updateTag(tags.seasons())
  updateTag(tags.fmfData())

  return ok({ seasonId: result.data.seasonId })
}
