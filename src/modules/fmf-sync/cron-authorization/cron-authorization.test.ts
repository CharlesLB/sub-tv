import { describe, expect, it } from 'vitest'
import { isAuthorizedCronRequest } from './cron-authorization'

const SECRET = 'segredo-de-teste-com-tamanho-suficiente'

describe('isAuthorizedCronRequest', () => {
  it('accepts the bearer token equal to the configured secret', () => {
    expect(isAuthorizedCronRequest(`Bearer ${SECRET}`, SECRET)).toBe(true)
  })

  it('rejects a missing header, a wrong token or an unconfigured secret', () => {
    expect(isAuthorizedCronRequest(null, SECRET)).toBe(false)
    expect(isAuthorizedCronRequest('Bearer outro', SECRET)).toBe(false)
    expect(isAuthorizedCronRequest(SECRET, SECRET)).toBe(false)
    expect(isAuthorizedCronRequest(`Bearer ${SECRET}`, undefined)).toBe(false)
  })
})
