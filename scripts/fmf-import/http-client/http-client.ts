import { FMF_USER_AGENT } from '../constants/fmf-sources'

const MINIMUM_INTERVAL_MS = 1_200
const MAXIMUM_ATTEMPTS = 4
const BACKOFF_BASE_MS = 3_000
const REQUEST_TIMEOUT_MS = 30_000
const NOT_FOUND_STATUS = 404
const HTTP_METHOD = { GET: 'GET', POST: 'POST' } as const
const FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded'

const requestClock = { lastRequestAt: 0 }

export type CookieJar = { cookies: Record<string, string> }

export const createCookieJar = (): CookieJar => ({ cookies: {} })

export type HttpRequest = {
  url: string
  form?: URLSearchParams
  cookieJar?: CookieJar
}

export type HttpResult = { found: true; body: Uint8Array } | { found: false; status: number }

const waitMilliseconds = (milliseconds: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, milliseconds))

const waitForRateLimit = async (): Promise<void> => {
  const elapsed = Date.now() - requestClock.lastRequestAt
  if (elapsed < MINIMUM_INTERVAL_MS) await waitMilliseconds(MINIMUM_INTERVAL_MS - elapsed)
  requestClock.lastRequestAt = Date.now()
}

const serializeCookies = (cookieJar: CookieJar): string =>
  Object.entries(cookieJar.cookies)
    .map(([name, value]) => `${name}=${value}`)
    .join('; ')

const storeCookies = (response: Response, cookieJar: CookieJar | undefined): void => {
  if (!cookieJar) return

  const receivedCookies = response.headers
    .getSetCookie()
    .map((cookie) => cookie.split(';')[0] ?? '')
    .map((pair) => pair.split('='))
    .filter((parts) => parts.length >= 2)
    .map(([name = '', ...valueParts]): [string, string] => [name.trim(), valueParts.join('=')])

  cookieJar.cookies = { ...cookieJar.cookies, ...Object.fromEntries(receivedCookies) }
}

const buildHeaders = (request: HttpRequest): Record<string, string> => ({
  'User-Agent': FMF_USER_AGENT,
  ...(request.form ? { 'Content-Type': FORM_CONTENT_TYPE } : {}),
  ...(request.cookieJar && Object.keys(request.cookieJar.cookies).length > 0 ? { Cookie: serializeCookies(request.cookieJar) } : {}),
})

const performRequest = async (request: HttpRequest): Promise<Response> => {
  await waitForRateLimit()

  return await fetch(request.url, {
    method: request.form ? HTTP_METHOD.POST : HTTP_METHOD.GET,
    headers: buildHeaders(request),
    ...(request.form ? { body: request.form.toString() } : {}),
    redirect: 'follow',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
}

const describeError = (error: unknown): string => (error instanceof Error ? error.message : String(error))

const requestWithRetry = async (request: HttpRequest, attempt: number): Promise<HttpResult> => {
  try {
    const response = await performRequest(request)
    storeCookies(response, request.cookieJar)
    if (response.status === NOT_FOUND_STATUS) return { found: false, status: response.status }
    if (!response.ok) throw new Error(`HTTP ${response.status} em ${request.url}`)

    return { found: true, body: new Uint8Array(await response.arrayBuffer()) }
  } catch (error) {
    if (attempt >= MAXIMUM_ATTEMPTS) throw new Error(`falha ao baixar ${request.url}: ${describeError(error)}`)
    console.warn(`tentativa ${attempt} falhou para ${request.url}: ${describeError(error)}`)
    await waitMilliseconds(BACKOFF_BASE_MS * 2 ** (attempt - 1))

    return await requestWithRetry(request, attempt + 1)
  }
}

export const requestFmf = async (request: HttpRequest): Promise<HttpResult> => await requestWithRetry(request, 1)

export const decodeUtf8 = (body: Uint8Array): string => new TextDecoder('utf-8').decode(body)
