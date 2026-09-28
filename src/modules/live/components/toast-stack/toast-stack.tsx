'use client'

import { useLiveState } from '../../state/live-context'
import { useLiveCommands } from '../../state/use-live-commands'
import { ToastCard } from '../toast-card/toast-card'
import { toastStackStyles as styles } from './toast-stack.styles'

export function ToastStack() {
  const { toasts } = useLiveState()
  const { undo, dismissToast } = useLiveCommands()
  if (toasts.length === 0) return null

  return (
    <div className={styles.stack}>
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onUndo={undo} onDismiss={dismissToast} />
      ))}
    </div>
  )
}
