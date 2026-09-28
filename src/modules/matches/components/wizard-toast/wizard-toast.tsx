'use client'

import { useEffect } from 'react'
import { Icon } from '@/components/ui/icon/icon'
import { wizardToastStyles as styles } from './wizard-toast.styles'

const TOAST_DURATION_MS = 3800
const TITLE_SEPARATOR = ' · '

type WizardToastProps = { message: string; onClose: () => void }

export function WizardToast({ message, onClose }: WizardToastProps) {
  const [title, ...descriptionParts] = message.split(TITLE_SEPARATOR)
  const description = descriptionParts.join(TITLE_SEPARATOR)

  useEffect(() => {
    const timer = setTimeout(onClose, TOAST_DURATION_MS)

    return () => clearTimeout(timer)
  }, [message, onClose])

  return (
    <div role="alert" className={styles.toast}>
      <span aria-hidden className={styles.accent} />
      <Icon name="error" size={18} className={styles.icon} />
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
