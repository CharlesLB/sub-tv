'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui/icon/icon'
import { flashToastStyles as styles } from './flash-toast.styles'

const TOAST_DURATION_MS = 3800
const TITLE_SEPARATOR = ' · '

export type FlashTone = 'success' | 'warning'

const TONE_ICON: Record<FlashTone, 'checkCircle' | 'error'> = {
  success: 'checkCircle',
  warning: 'error',
}

type FlashToastProps = { message: string; tone: FlashTone; onClose: () => void }

export function FlashToast({ message, tone, onClose }: FlashToastProps) {
  const [title, ...descriptionParts] = message.split(TITLE_SEPARATOR)
  const description = descriptionParts.join(TITLE_SEPARATOR)

  useEffect(() => {
    const timer = setTimeout(onClose, TOAST_DURATION_MS)

    return () => clearTimeout(timer)
  }, [message, onClose])

  return (
    <div role={tone === 'warning' ? 'alert' : 'status'} className={styles.toast}>
      <span aria-hidden className={cn(styles.bar, styles.barTone[tone])} />
      <Icon name={TONE_ICON[tone]} size={18} className={cn(styles.icon, styles.iconTone[tone])} />
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        {description ? <div className={styles.description}>{description}</div> : null}
      </div>
      <button type="button" onClick={onClose} aria-label="Fechar notificação" className={styles.closeButton}>
        <Icon name="close" size={16} />
      </button>
    </div>
  )
}
