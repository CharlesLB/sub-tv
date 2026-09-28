'use client'

import { useEffect } from 'react'
import { Icon } from '@/components/ui/icon/icon'

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
    <div
      role="alert"
      className="fixed right-5 bottom-5 z-[74] flex w-[min(370px,calc(100vw-40px))] animate-toast-in items-start gap-[11px] border border-pan3 bg-pan2 py-[13px] pr-[13px] pl-[18px]"
    >
      <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-am" />
      <Icon name="error" size={18} className="mt-px text-am" />
      <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <div className="text-[12.2px] font-bold tracking-[-.01em] text-pretty text-tx">{title}</div>
        {description ? <div className="text-[12.5px] leading-[1.35] text-pretty text-tx3">{description}</div> : null}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar notificação"
        className="flex size-[22px] flex-none items-center justify-center bg-transparent p-0 text-tx5 transition-colors duration-[140ms] hover:text-tx"
      >
        <Icon name="close" size={16} />
      </button>
    </div>
  )
}
