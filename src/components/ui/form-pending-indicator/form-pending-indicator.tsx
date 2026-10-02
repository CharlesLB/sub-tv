'use client'

import { useFormStatus } from 'react-dom'
import { NavigationProgress } from '../navigation-progress/navigation-progress'

export function FormPendingIndicator() {
  const { pending } = useFormStatus()

  return <NavigationProgress isActive={pending} />
}
