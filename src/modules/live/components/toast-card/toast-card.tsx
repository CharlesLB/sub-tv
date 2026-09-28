'use client'

import { useEffect, useEffectEvent } from 'react'
import { Icon } from '@/components/ui/icon/icon'
import type { IconName } from '@/components/ui/icon/icon-paths'
import { cn } from '@/lib/utils/cn'
import { TOAST_TONE, type Toast, type ToastTone } from '../../state/live-state'

export const UNDO_WINDOW_MS = 8_000
const NOTICE_DURATION_MS = 3_600
const TITLE_SEPARATOR = ' — '

const TONE: Record<ToastTone, { icon: IconName; colorClass: string; stripeClass: string }> = {
  [TOAST_TONE.OK]: { icon: 'checkCircle', colorClass: 'text-ac', stripeClass: 'bg-ac' },
  [TOAST_TONE.WARN]: { icon: 'error', colorClass: 'text-am', stripeClass: 'bg-am' },
  [TOAST_TONE.INFO]: { icon: 'info', colorClass: 'text-az', stripeClass: 'bg-az' },
}

type ToastCardProps = { toast: Toast; onUndo: (toastId: number) => void; onDismiss: (toastId: number) => void }

export function ToastCard({ toast, onUndo, onDismiss }: ToastCardProps) {
  const tone = TONE[toast.tone]
  const [title, ...descriptionParts] = toast.message.split(TITLE_SEPARATOR)
  const description = descriptionParts.join(TITLE_SEPARATOR)

  const visibleForMs = toast.undo ? UNDO_WINDOW_MS : NOTICE_DURATION_MS
  const dismissSelf = useEffectEvent(() => onDismiss(toast.id))

  useEffect(() => {
    const timer = setTimeout(dismissSelf, visibleForMs)

    return () => clearTimeout(timer)
  }, [visibleForMs])

  return (
    <div
      role={toast.tone === TOAST_TONE.WARN ? 'alert' : 'status'}
      className="pointer-events-auto relative box-border flex w-[min(370px,calc(100vw-40px))] animate-toast-in items-start gap-[11px] rounded-[2px] border border-pan3 bg-pan2 py-[13px] pr-[13px] pl-[18px]"
    >
      <span className={cn('absolute top-0 bottom-0 left-0 w-[3px]', tone.stripeClass)} />
      <Icon name={tone.icon} size={18} className={cn('mt-px', tone.colorClass)} />
      <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <div className="text-[12.2px] font-bold tracking-[-.01em] text-pretty text-tx">{title}</div>
        {description ? <div className="text-[12.5px] leading-[1.35] text-pretty text-tx3">{description}</div> : null}
      </div>
      {toast.undo ? (
        <button
          type="button"
          onClick={() => onUndo(toast.id)}
          className="h-7 flex-none self-center rounded-card border border-bd2 bg-transparent px-[11px] text-[9.9px] font-bold tracking-[-.01em] text-tx2 transition-colors duration-150 hover:bg-bd hover:text-tx"
        >
          Desfazer
        </button>
      ) : null}
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Fechar notificação"
        className="flex size-[22px] flex-none items-center justify-center border-0 bg-transparent p-0 text-tx5 transition-colors duration-150 hover:text-tx"
      >
        <Icon name="close" size={16} />
      </button>
    </div>
  )
}
