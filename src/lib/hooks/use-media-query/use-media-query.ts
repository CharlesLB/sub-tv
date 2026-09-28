'use client'

import { useSyncExternalStore } from 'react'

const subscribeTo = (query: string) => (onChange: () => void) => {
  const mediaQueryList = window.matchMedia(query)
  mediaQueryList.addEventListener('change', onChange)

  return () => mediaQueryList.removeEventListener('change', onChange)
}

export const useMediaQuery = (query: string, serverFallback = false): boolean =>
  useSyncExternalStore(
    subscribeTo(query),
    () => window.matchMedia(query).matches,
    () => serverFallback,
  )
