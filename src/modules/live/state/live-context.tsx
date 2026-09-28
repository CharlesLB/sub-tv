'use client'

import { createContext, type Dispatch, type ReactNode, use, useReducer } from 'react'
import type { LiveMatchSnapshot } from '@/modules/matches/client'
import { useLiveSync } from '../sync/use-live-sync'
import { useMatchStream } from '../sync/use-match-stream'
import { createInitialState } from './initial-state'
import type { LiveAction } from './live-actions'
import { liveReducer } from './live-reducer'
import type { LiveState } from './live-state'

const MISSING_PROVIDER = 'LiveMatchProvider ausente: envolva a tela ao vivo com ele.'

const LiveStateContext = createContext<LiveState | null>(null)
const LiveDispatchContext = createContext<Dispatch<LiveAction> | null>(null)

type LiveMatchProviderProps = { snapshot: LiveMatchSnapshot; children: ReactNode }

export function LiveMatchProvider({ snapshot, children }: LiveMatchProviderProps) {
  const [state, dispatch] = useReducer(liveReducer, snapshot, createInitialState)
  useLiveSync(snapshot.matchId, state.outbox, Object.keys(state.pendingSyncCounts).length > 0, dispatch)
  useMatchStream(snapshot.matchId, dispatch)

  return (
    <LiveDispatchContext value={dispatch}>
      <LiveStateContext value={state}>{children}</LiveStateContext>
    </LiveDispatchContext>
  )
}

export const useLiveState = (): LiveState => {
  const state = use(LiveStateContext)
  if (!state) throw new Error(MISSING_PROVIDER)

  return state
}

export const useLiveDispatch = (): Dispatch<LiveAction> => {
  const dispatch = use(LiveDispatchContext)
  if (!dispatch) throw new Error(MISSING_PROVIDER)

  return dispatch
}
