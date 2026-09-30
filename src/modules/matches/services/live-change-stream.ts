import 'server-only'
import { type LiveChanges, readLiveChanges } from '../data/read-live-changes'
import { STREAM_MESSAGE } from '../lib/live-stream-messages/live-stream-messages'

const POLL_INTERVAL_MS = 1_500
const HEARTBEAT_INTERVAL_MS = 15_000
const RECONNECT_DELAY_MS = 2_000
const STREAM_LIFETIME_MS = 280_000

type StreamOptions = { matchId: string; sinceMs: number; signal: AbortSignal }

type Versioned = { versionKey: string; version: string; updatedMs: number }

const encoder = new TextEncoder()

const unsent = <TItem extends Versioned>(items: TItem[], sentVersions: Map<string, string>): TItem[] => items.filter((item) => sentVersions.get(item.versionKey) !== item.version)

export const createLiveChangeStream = ({ matchId, sinceMs, signal }: StreamOptions): ReadableStream<Uint8Array> => {
  const session = { seq: 0, watermarkMs: sinceMs, isClosed: false, sentVersions: new Map<string, string>() }
  const timers: Record<'poll' | 'heartbeat' | 'lifetime', ReturnType<typeof setTimeout> | undefined> = { poll: undefined, heartbeat: undefined, lifetime: undefined }

  const stopTimers = () => {
    session.isClosed = true
    clearTimeout(timers.poll)
    clearTimeout(timers.lifetime)
    clearInterval(timers.heartbeat)
  }

  return new ReadableStream<Uint8Array>({
    start(controller) {
      const write = (text: string) => {
        if (!session.isClosed) controller.enqueue(encoder.encode(text))
      }

      const send = (eventName: string, payload: Record<string, unknown>) => {
        session.seq += 1
        write(`id: ${session.watermarkMs}\nevent: ${eventName}\ndata: ${JSON.stringify({ ...payload, seq: session.seq })}\n\n`)
      }

      const close = () => {
        if (session.isClosed) return
        stopTimers()
        controller.close()
      }

      const publish = (changes: LiveChanges) => {
        const events = unsent(changes.events, session.sentVersions)
        const positions = unsent(changes.positions, session.sentVersions)
        const clock = changes.clock && unsent([changes.clock], session.sentVersions).length > 0 ? changes.clock : null
        const published = [...events, ...positions, ...(clock ? [clock] : [])]
        if (published.length === 0) return

        session.watermarkMs = Math.max(session.watermarkMs, ...published.map((item) => item.updatedMs))
        published.map((item) => session.sentVersions.set(item.versionKey, item.version))
        events.map((event) => send(STREAM_MESSAGE.MATCH_EVENT, event.item))
        if (clock || positions.length > 0) send(STREAM_MESSAGE.SNAPSHOT_CHANGED, { clock: clock?.item ?? null, positions: positions.map((position) => position.item) })
      }

      const poll = async () => {
        if (session.isClosed) return

        try {
          publish(await readLiveChanges(matchId, session.watermarkMs))
        } catch {
          write(': retry\n\n')
        }

        if (!session.isClosed) timers.poll = setTimeout(poll, POLL_INTERVAL_MS)
      }

      timers.heartbeat = setInterval(() => write(': ping\n\n'), HEARTBEAT_INTERVAL_MS)
      timers.lifetime = setTimeout(close, STREAM_LIFETIME_MS)
      signal.addEventListener('abort', close)
      write(`retry: ${RECONNECT_DELAY_MS}\n\n`)
      void poll()
    },
    cancel() {
      stopTimers()
    },
  })
}
