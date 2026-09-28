import { describe, expect, it } from 'vitest'
import { API_ERROR_CODE, apiError, HTTP_STATUS } from './api-error'

describe('apiError', () => {
  it('answers with the status and the error contract body', async () => {
    const response = apiError(HTTP_STATUS.NOT_FOUND, API_ERROR_CODE.NOT_FOUND, 'Partida não encontrada.')

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ error: { code: 'not_found', message: 'Partida não encontrada.' } })
  })
})
