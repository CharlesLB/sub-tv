import { revalidateTag } from 'next/cache'
import type { NextRequest } from 'next/server'
import { tags } from '@/lib/cache/tags'
import { env } from '@/lib/env'
import { isAuthorizedCronRequest, runNightlyFmfSync } from '@/modules/fmf-sync'

export const maxDuration = 300

const AUTHORIZATION_HEADER = 'authorization'
const REVALIDATION_PROFILE = 'max'
const UNAUTHORIZED_STATUS = 401
const SERVER_ERROR_STATUS = 500
const ERROR_CODE = { UNAUTHORIZED: 'unauthorized', SYNC_FAILED: 'sync_failed', NOT_CONFIGURED: 'cron_not_configured' } as const

const errorResponse = (status: number, code: string, message: string): Response => Response.json({ error: { code, message } }, { status })

export const GET = async (request: NextRequest): Promise<Response> => {
  if (!env.CRON_SECRET) return errorResponse(SERVER_ERROR_STATUS, ERROR_CODE.NOT_CONFIGURED, 'Sincronização não configurada.')
  if (!isAuthorizedCronRequest(request.headers.get(AUTHORIZATION_HEADER), env.CRON_SECRET)) {
    return errorResponse(UNAUTHORIZED_STATUS, ERROR_CODE.UNAUTHORIZED, 'Acesso não autorizado.')
  }

  try {
    const summary = await runNightlyFmfSync()
    const seasonTags = summary.touchedSeasonIds.flatMap((seasonId) => [tags.season(seasonId), tags.seasonMatches(seasonId), tags.seasonTeams(seasonId)])
    const revalidatedTags = [tags.fmfData(), tags.seasons(), tags.history(), ...seasonTags]
    revalidatedTags.map((tag) => revalidateTag(tag, REVALIDATION_PROFILE))

    return Response.json({ data: summary })
  } catch (error) {
    console.error('sincronização FMF falhou', error)

    return errorResponse(SERVER_ERROR_STATUS, ERROR_CODE.SYNC_FAILED, 'A sincronização com a FMF falhou.')
  }
}
