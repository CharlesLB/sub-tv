'use client'

import { useEffect, type Dispatch } from 'react'
import { apiRoutes } from '@/lib/routes'
import { RemoteEventSchema, RemoteSnapshotSchema, STREAM_MESSAGE } from '@/modules/matches/client'
import { LIVE_ACTION, type LiveAction } from '../state/live-actions'
import { STREAM_STATUS } from '../state/live-state'

const parseJson = (text: string): unknown => {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export const useMatchStream = (matchId: string, dispatch: Dispatch<LiveAction>): void => {
  useEffect(() => {
    const source = new EventSource(apiRoutes.liveStream(matchId))
    const setStatus = (status: (typeof STREAM_STATUS)[keyof typeof STREAM_STATUS]) => dispatch({ type: LIVE_ACTION.STREAM_STATUS_CHANGED, status })

    const handleEvent = (message: MessageEvent<string>) => {
      const parsed = RemoteEventSchema.safeParse(parseJson(message.data))
      if (parsed.success) dispatch({ type: LIVE_ACTION.REMOTE_EVENT_RECEIVED, event: parsed.data })
    }

    const handleSnapshot = (message: MessageEvent<string>) => {
      const parsed = RemoteSnapshotSchema.safeParse(parseJson(message.data))
      if (parsed.success) dispatch({ type: LIVE_ACTION.REMOTE_SNAPSHOT_RECEIVED, snapshot: parsed.data })
    }

    source.addEventListener('open', () => setStatus(STREAM_STATUS.CONNECTED))
    source.addEventListener('error', () => setStatus(STREAM_STATUS.RECONNECTING))
    source.addEventListener(STREAM_MESSAGE.MATCH_EVENT, handleEvent)
    source.addEventListener(STREAM_MESSAGE.SNAPSHOT_CHANGED, handleSnapshot)

    return () => source.close()
  }, [matchId, dispatch])
}
