import { revalidateTag } from 'next/cache'
import type { NextRequest } from 'next/server'
import { API_ERROR_CODE, apiError, HTTP_STATUS } from '@/lib/api/api-error/api-error'
import { tags } from '@/lib/cache/tags'
import { env } from '@/lib/env'
import { isAuthorizedCronRequest, runNightlyFmfSync } from '@/modules/fmf-sync'

export const maxDuration = 300

const AUTHORIZATION_HEADER = 'authorization'
const REVALIDATION_PROFILE = 'max'

export const GET = async (request: NextRequest): Promise<Response> => {
  if (!env.CRON_SECRET) return apiError(HTTP_STATUS.SERVER_ERROR, API_ERROR_CODE.CRON_NOT_CONFIGURED, 'Sincronização não configurada.')

  if (!isAuthorizedCronRequest(request.headers.get(AUTHORIZATION_HEADER), env.CRON_SECRET)) {
    return apiError(HTTP_STATUS.UNAUTHORIZED, API_ERROR_CODE.UNAUTHORIZED, 'Acesso não autorizado.')
  }

  try {
    const summary = await runNightlyFmfSync()
    const seasonTags = summary.touchedSeasonIds.flatMap((seasonId) => [tags.season(seasonId), tags.seasonMatches(seasonId), tags.seasonTeams(seasonId)])
    const revalidatedTags = [tags.fmfData(), tags.seasons(), tags.history(), ...seasonTags]
    revalidatedTags.map((tag) => revalidateTag(tag, REVALIDATION_PROFILE))

    return Response.json({ data: summary })
  } catch (error) {
    console.error('sincronização FMF falhou', error)

    return apiError(HTTP_STATUS.SERVER_ERROR, API_ERROR_CODE.SYNC_FAILED, 'A sincronização com a FMF falhou.')
  }
}
