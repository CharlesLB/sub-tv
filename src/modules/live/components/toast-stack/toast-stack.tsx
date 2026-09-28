'use client'

import { useLiveState } from '../../state/live-context'
import { useLiveCommands } from '../../state/use-live-commands'
import { ToastCard } from '../toast-card/toast-card'

export function ToastStack() {
  const { toasts } = useLiveState()
  const { undo, dismissToast } = useLiveCommands()
  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed right-5 bottom-5 z-[74] flex flex-col-reverse gap-[10px] mobile:right-3 mobile:bottom-[72px]">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onUndo={undo} onDismiss={dismissToast} />
      ))}
    </div>
  )
}
