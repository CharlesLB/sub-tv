'use client'

import { useSyncExternalStore } from 'react'

const TICK_MS = 1_000

const subscribeToTicks = (onTick: () => void) => {
  const timer = setInterval(onTick, TICK_MS)

  return () => clearInterval(timer)
}

const subscribeToNothing = () => () => {}

const readCurrentSecond = (): number => Math.floor(Date.now() / TICK_MS) * TICK_MS

const readServerSecond = (): number | null => null

export const useClockTick = (isTicking: boolean): number | null =>
  useSyncExternalStore(isTicking ? subscribeToTicks : subscribeToNothing, readCurrentSecond, readServerSecond)
