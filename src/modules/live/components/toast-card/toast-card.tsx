'use client'

import { useEffect, useEffectEvent } from 'react'
import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui/icon/icon'
import type { IconName } from '@/components/ui/icon/icon-paths'
import { TOAST_TONE, type Toast, type ToastTone } from '../../state/live-state'
import { toastCardStyles as styles } from './toast-card.styles'

export const UNDO_WINDOW_MS = 8_000
const NOTICE_DURATION_MS = 3_600
const TITLE_SEPARATOR = ' — '

const TONE_ICON: Record<ToastTone, IconName> = {
  [TOAST_TONE.OK]: 'checkCircle',
  [TOAST_TONE.WARN]: 'error',
  [TOAST_TONE.INFO]: 'info',
}

type ToastCardProps = { toast: Toast; onUndo: (toastId: number) => void; onDismiss: (toastId: number) => void }

export function ToastCard({ toast, onUndo, onDismiss }: ToastCardProps) {
  const [title, ...descriptionParts] = toast.message.split(TITLE_SEPARATOR)
  const description = descriptionParts.join(TITLE_SEPARATOR)

  const visibleForMs = toast.undo ? UNDO_WINDOW_MS : NOTICE_DURATION_MS
  const dismissSelf = useEffectEvent(() => onDismiss(toast.id))

  useEffect(() => {
    const timer = setTimeout(dismissSelf, visibleForMs)

    return () => clearTimeout(timer)
  }, [visibleForMs])

  return (
    <div role={toast.tone === TOAST_TONE.WARN ? 'alert' : 'status'} className={styles.card}>
      <span className={cn(styles.stripe, styles.toneStripe[toast.tone])} />
      <Icon name={TONE_ICON[toast.tone]} size={18} className={cn(styles.icon, styles.toneIcon[toast.tone])} />
      <div className={styles.texts}>
        <div className={styles.title}>{title}</div>
        {description ? <div className={styles.description}>{description}</div> : null}
      </div>
      {toast.undo ? (
        <button type="button" onClick={() => onUndo(toast.id)} className={styles.undoButton}>
          Desfazer
        </button>
      ) : null}
      <button type="button" onClick={() => onDismiss(toast.id)} aria-label="Fechar notificação" className={styles.closeButton}>
        <Icon name="close" size={16} />
      </button>
    </div>
  )
}
