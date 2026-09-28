import type { NextRequest } from 'next/server'
import { isUuid } from '@/lib/utils/is-uuid/is-uuid'
import { getCurrentUser } from '@/modules/auth'
import { createLiveChangeStream } from '@/modules/matches'

export const maxDuration = 300

const LAST_EVENT_ID_HEADER = 'last-event-id'

const STREAM_HEADERS = {
  'Content-Type': 'text/event-stream; charset=utf-8',
  'Cache-Control': 'no-cache, no-transform',
  Connection: 'keep-alive',
  'X-Accel-Buffering': 'no',
}

const errorResponse = (status: number, code: string, message: string) => Response.json({ error: { code, message } }, { status })

const sinceOf = (lastEventId: string | null): number => {
  const parsed = Number(lastEventId)

  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

export const GET = async (request: NextRequest, context: RouteContext<'/api/partidas/[partidaId]/stream'>): Promise<Response> => {
  const user = await getCurrentUser()
  if (!user) return errorResponse(401, 'unauthorized', 'Sessão expirada. Entre de novo para acompanhar a partida.')

  const { partidaId } = await context.params
  if (!isUuid(partidaId)) return errorResponse(404, 'not_found', 'Partida não encontrada.')

  const stream = createLiveChangeStream({ matchId: partidaId, sinceMs: sinceOf(request.headers.get(LAST_EVENT_ID_HEADER)), signal: request.signal })

  return new Response(stream, { headers: STREAM_HEADERS })
}
