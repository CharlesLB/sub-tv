const BASE_RETRY_DELAY_MS = 1_000
const MAXIMUM_RETRY_DELAY_MS = 30_000

export const SEND_OUTCOME = { SENT: 'sent', REJECTED: 'rejected' } as const

export type SendOutcome = { status: typeof SEND_OUTCOME.SENT } | { status: typeof SEND_OUTCOME.REJECTED; message: string }

export type QueuedItem<TOperation> = { operation: TOperation; coalesceKey: string | null }

type EventQueueOptions<TOperation> = {
  send: (operation: TOperation) => Promise<SendOutcome>
  onSent: (operation: TOperation) => void
  onRejected: (operation: TOperation, message: string) => void
  onFailure: () => void
  onRecovered: () => void
  onDropped: (operation: TOperation) => void
  wait: (milliseconds: number) => Promise<void>
}

export type EventQueue<TOperation> = {
  enqueue: (items: QueuedItem<TOperation>[]) => void
  pendingCount: () => number
}

export const retryDelayMs = (attempt: number): number => Math.min(BASE_RETRY_DELAY_MS * 2 ** Math.max(0, attempt - 1), MAXIMUM_RETRY_DELAY_MS)

const replaceableIndexOf = <TOperation>(pending: QueuedItem<TOperation>[], item: QueuedItem<TOperation>, isHeadInFlight: boolean): number =>
  item.coalesceKey === null ? -1 : pending.findIndex((queued, index) => queued.coalesceKey === item.coalesceKey && !(isHeadInFlight && index === 0))

export const createEventQueue = <TOperation>(options: EventQueueOptions<TOperation>): EventQueue<TOperation> => {
  const initialPending: QueuedItem<TOperation>[] = []
  const queue = { pending: initialPending, isRunning: false, failedAttempts: 0 }

  const settleHead = (outcome: SendOutcome, head: QueuedItem<TOperation>) => {
    queue.pending = queue.pending.slice(1)
    if (queue.failedAttempts > 0) options.onRecovered()
    queue.failedAttempts = 0
    if (outcome.status === SEND_OUTCOME.SENT) options.onSent(head.operation)
    else options.onRejected(head.operation, outcome.message)
  }

  const drain = async (): Promise<void> => {
    const head = queue.pending[0]
    if (queue.isRunning || !head) return

    queue.isRunning = true
    try {
      settleHead(await options.send(head.operation), head)
    } catch {
      queue.failedAttempts += 1
      options.onFailure()
      await options.wait(retryDelayMs(queue.failedAttempts))
    }
    queue.isRunning = false
    await drain()
  }

  return {
    enqueue: (items) => {
      queue.pending = items.reduce((pending, item) => {
        const replaceableIndex = replaceableIndexOf(pending, item, queue.isRunning)
        const replaced = pending[replaceableIndex]
        if (!replaced) return [...pending, item]
        options.onDropped(replaced.operation)

        return pending.map((queued, index) => (index === replaceableIndex ? item : queued))
      }, queue.pending)
      void drain()
    },
    pendingCount: () => queue.pending.length,
  }
}
