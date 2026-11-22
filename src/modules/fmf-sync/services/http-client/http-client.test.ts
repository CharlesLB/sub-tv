import { afterEach, describe, expect, it, vi } from 'vitest'
import { requestFmf } from './http-client'

describe('requestFmf', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('gives every request an abort signal so a hung FMF socket cannot block the sync forever', async () => {
    const fetchSpy = vi.fn(async (_url: string | URL | Request, _init?: RequestInit) => new Response('ok'))
    vi.stubGlobal('fetch', fetchSpy)

    await requestFmf({ url: 'https://example.test/page' })

    const init = fetchSpy.mock.calls[0]?.[1]
    expect(init?.signal).toBeInstanceOf(AbortSignal)
    expect(init?.signal?.aborted).toBe(false)
  })
})
