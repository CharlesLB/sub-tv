import { cn } from '@/lib/utils/cn'
import { STREAM_STATUS, type StreamStatus } from '../../state/live-state'

const STATUS_VIEW: Record<StreamStatus, { label: string; dotClass: string }> = {
  [STREAM_STATUS.CONNECTING]: { label: 'Conectando', dotClass: 'bg-bd3 animate-live-dot' },
  [STREAM_STATUS.CONNECTED]: { label: 'Sincronizado', dotClass: 'bg-ac2' },
  [STREAM_STATUS.RECONNECTING]: { label: 'Reconectando', dotClass: 'bg-am animate-live-dot' },
}

const SAVING_VIEW = { label: 'Salvando', dotClass: 'bg-az animate-live-dot' } as const

type ConnectionIndicatorProps = { status: StreamStatus; isSaving: boolean }

export function ConnectionIndicator({ status, isSaving }: ConnectionIndicatorProps) {
  const view = isSaving && status === STREAM_STATUS.CONNECTED ? SAVING_VIEW : STATUS_VIEW[status]

  return (
    <span role="status" title={`Tempo real: ${view.label.toLowerCase()}`} className="flex flex-none items-center gap-[6px] text-[9.5px] font-semibold tracking-[-.01em] text-tx4">
      <span aria-hidden className={cn('size-[7px] rounded-full', view.dotClass)} />
      <span className="mobile:sr-only">{view.label}</span>
    </span>
  )
}
