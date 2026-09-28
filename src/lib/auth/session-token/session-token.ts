export const SESSION_COOKIE = 'subtv_sessao'
export const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 14

const SIGNATURE_ALGORITHM = { name: 'HMAC', hash: 'SHA-256' } as const
const TOKEN_SEPARATOR = '.'
const USER_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

export type Session = { userId: string; expiresAt: number }

const textEncoder = new TextEncoder()

const toHex = (buffer: ArrayBuffer): string =>
  Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, '0')).join('')

const importSigningKey = (secret: string): Promise<CryptoKey> =>
  crypto.subtle.importKey('raw', textEncoder.encode(secret), SIGNATURE_ALGORITHM, false, ['sign'])

const sign = async (payload: string, secret: string): Promise<string> =>
  toHex(await crypto.subtle.sign(SIGNATURE_ALGORITHM, await importSigningKey(secret), textEncoder.encode(payload)))

const constantTimeEquals = (left: string, right: string): boolean =>
  left.length === right.length &&
  Array.from(left).reduce((difference, character, index) => difference | (character.charCodeAt(0) ^ right.charCodeAt(index)), 0) === 0

export const createSessionToken = async (userId: string, secret: string, nowInSeconds: number): Promise<string> => {
  const payload = [userId, String(nowInSeconds + SESSION_DURATION_SECONDS)].join(TOKEN_SEPARATOR)

  return [payload, await sign(payload, secret)].join(TOKEN_SEPARATOR)
}

export const readSessionToken = async (token: string | undefined, secret: string, nowInSeconds: number): Promise<Session | null> => {
  const [userId, expiresAtText, signature] = (token ?? '').split(TOKEN_SEPARATOR)
  if (!userId || !USER_ID_PATTERN.test(userId) || !expiresAtText || !signature) return null

  const expiresAt = Number(expiresAtText)
  if (!Number.isFinite(expiresAt) || expiresAt < nowInSeconds) return null

  const expectedSignature = await sign([userId, expiresAtText].join(TOKEN_SEPARATOR), secret)

  return constantTimeEquals(signature, expectedSignature) ? { userId, expiresAt } : null
}
