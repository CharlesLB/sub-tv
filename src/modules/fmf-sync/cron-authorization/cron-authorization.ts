import { timingSafeEqual } from 'node:crypto'

const BEARER_PREFIX = 'Bearer '

export const isAuthorizedCronRequest = (authorizationHeader: string | null, cronSecret: string | undefined): boolean => {
  if (!cronSecret || !authorizationHeader?.startsWith(BEARER_PREFIX)) return false
  const provided = Buffer.from(authorizationHeader.slice(BEARER_PREFIX.length))
  const expected = Buffer.from(cronSecret)

  return provided.length === expected.length && timingSafeEqual(provided, expected)
}
