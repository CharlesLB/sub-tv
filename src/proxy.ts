import { type NextRequest, NextResponse } from 'next/server'
import { readSessionToken, SESSION_COOKIE } from '@/lib/auth/session-token/session-token'

const LOGIN_PATH = '/entrar'
const RETURN_PARAMETER = 'para'
const API_PATH_PREFIX = '/api/'
const UNAUTHORIZED_STATUS = 401

export const proxy = async (request: NextRequest): Promise<NextResponse> => {
  const secret = process.env.SESSION_SECRET ?? ''
  const session = await readSessionToken(request.cookies.get(SESSION_COOKIE)?.value, secret, Math.floor(Date.now() / 1000))
  if (session) return NextResponse.next()

  if (request.nextUrl.pathname.startsWith(API_PATH_PREFIX)) {
    return NextResponse.json({ error: { code: 'unauthorized', message: 'Entre no sistema para continuar.' } }, { status: UNAUTHORIZED_STATUS })
  }

  const loginUrl = new URL(LOGIN_PATH, request.url)
  loginUrl.searchParams.set(RETURN_PARAMETER, `${request.nextUrl.pathname}${request.nextUrl.search}`)

  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/campeonatos/:campeonatoId/nova-partida', '/ao-vivo/:path*', '/registro/:path*', '/usuarios/:path*', '/api/((?!cron).*)'],
}
