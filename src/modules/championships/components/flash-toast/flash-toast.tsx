'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui/icon/icon'

const TOAST_DURATION_MS = 3800
const TITLE_SEPARATOR = ' · '

export type FlashTone = 'success' | 'warning'

const TONE_STYLE: Record<FlashTone, { bar: string; icon: string; iconName: 'checkCircle' | 'error' }> = {
  success: { bar: 'bg-ac', icon: 'text-ac', iconName: 'checkCircle' },
  warning: { bar: 'bg-am', icon: 'text-am', iconName: 'error' },
}

type FlashToastProps = { message: string; tone: FlashTone; onClose: () => void }

export function FlashToast({ message, tone, onClose }: FlashToastProps) {
  const [title, ...descriptionParts] = message.split(TITLE_SEPARATOR)
  const description = descriptionParts.join(TITLE_SEPARATOR)
  const style = TONE_STYLE[tone]

  useEffect(() => {
    const timer = setTimeout(onClose, TOAST_DURATION_MS)

    return () => clearTimeout(timer)
  }, [message, onClose])

  return (
    <div
      role={tone === 'warning' ? 'alert' : 'status'}
      className="fixed right-5 bottom-5 z-[74] flex w-[min(370px,calc(100vw-40px))] animate-toast-in items-start gap-[11px] border border-pan3 bg-pan2 py-[13px] pr-[13px] pl-[18px] mobile:bottom-[76px]"
    >
      <span aria-hidden className={cn('absolute inset-y-0 left-0 w-[3px]', style.bar)} />
      <Icon name={style.iconName} size={18} className={cn('mt-px', style.icon)} />
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
