'use client'

import { useLinkStatus } from 'next/link'
import { NavigationProgress } from '../navigation-progress/navigation-progress'

export function LinkPendingIndicator() {
  const { pending } = useLinkStatus()

  return <NavigationProgress isActive={pending} />
}
