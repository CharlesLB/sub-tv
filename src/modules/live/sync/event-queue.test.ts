import { describe, expect, it, vi } from 'vitest'
import { createEventQueue, retryDelayMs, SEND_OUTCOME, type SendOutcome } from './event-queue'

const flush = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

const setup = (send: (operation: string) => Promise<SendOutcome>) => {
  const log = { sent: [] as string[], rejected: [] as string[], dropped: [] as string[], failures: 0, recoveries: 0, waits: [] as number[] }

  const queue = createEventQueue<string>({
    send,
    onSent: (operation) => log.sent.push(operation),
    onRejected: (operation) => log.rejected.push(operation),
    onFailure: () => {
      log.failures += 1
    },
    onRecovered: () => {
      log.recoveries += 1
    },
    onDropped: (operation) => log.dropped.push(operation),
    wait: async (milliseconds) => {
      log.waits.push(milliseconds)
    },
  })

  return { queue, log }
}

describe('event queue', () => {
  it('retry delay doubles per attempt and stops at thirty seconds', () => {
    expect([1, 2, 3, 10].map(retryDelayMs)).toEqual([1_000, 2_000, 4_000, 30_000])
  })

  it('operations sent successfully are reported in order', async () => {
    const { queue, log } = setup(async () => ({ status: SEND_OUTCOME.SENT }))

    queue.enqueue([
      { operation: 'goal', coalesceKey: null },
      { operation: 'card', coalesceKey: null },
    ])

    await flush()

    expect(log.sent).toEqual(['goal', 'card'])
    expect(queue.pendingCount()).toBe(0)
  })

  it('a network failure keeps the operation, retries with backoff and reports recovery', async () => {
    const send = vi.fn<(operation: string) => Promise<SendOutcome>>().mockRejectedValueOnce(new Error('offline')).mockResolvedValue({ status: SEND_OUTCOME.SENT })
    const { queue, log } = setup(send)

    queue.enqueue([{ operation: 'goal', coalesceKey: null }])
    await flush()

    expect(log.failures).toBe(1)
    expect(log.waits).toEqual([1_000])
    expect(log.sent).toEqual(['goal'])
    expect(log.recoveries).toBe(1)
  })

  it('a rejected operation is dropped and reported without retrying', async () => {
    const { queue, log } = setup(async () => ({ status: SEND_OUTCOME.REJECTED, message: 'inválido' }))

    queue.enqueue([{ operation: 'goal', coalesceKey: null }])
    await flush()

    expect(log.rejected).toEqual(['goal'])
    expect(log.failures).toBe(0)
  })

  it('operations with the same coalesce key replace the waiting one', async () => {
    const release = { resolve: () => {} }

    const firstSend = new Promise<void>((resolve) => {
      release.resolve = resolve
    })

    const send = vi.fn(async (operation: string): Promise<SendOutcome> => {
      if (operation === 'goal') await firstSend

      return { status: SEND_OUTCOME.SENT }
    })

    const { queue, log } = setup(send)

    queue.enqueue([{ operation: 'goal', coalesceKey: null }])

    queue.enqueue([
      { operation: 'clock-1', coalesceKey: 'clock' },
      { operation: 'clock-2', coalesceKey: 'clock' },
    ])

    release.resolve()
    await flush()

    expect(log.sent).toEqual(['goal', 'clock-2'])
    expect(log.dropped).toEqual(['clock-1'])
  })
})
