import { cn } from '@/lib/utils/cn'
import { STREAM_STATUS, type StreamStatus } from '../../state/live-state'
import { connectionIndicatorStyles as styles } from './connection-indicator.styles'

const STATUS_VIEW: Record<StreamStatus, { label: string; dotClass: string }> = {
  [STREAM_STATUS.CONNECTING]: { label: 'Conectando', dotClass: styles.statusDot[STREAM_STATUS.CONNECTING] },
  [STREAM_STATUS.CONNECTED]: { label: 'Sincronizado', dotClass: styles.statusDot[STREAM_STATUS.CONNECTED] },
  [STREAM_STATUS.RECONNECTING]: { label: 'Reconectando', dotClass: styles.statusDot[STREAM_STATUS.RECONNECTING] },
}

const SAVING_VIEW = { label: 'Salvando', dotClass: styles.savingDot } as const

type ConnectionIndicatorProps = { status: StreamStatus; isSaving: boolean }

export function ConnectionIndicator({ status, isSaving }: ConnectionIndicatorProps) {
  const view = isSaving && status === STREAM_STATUS.CONNECTED ? SAVING_VIEW : STATUS_VIEW[status]

  return (
    <span role="status" title={`Tempo real: ${view.label.toLowerCase()}`} className={styles.indicator}>
      <span aria-hidden className={cn(styles.dot, view.dotClass)} />
      <span className={styles.label}>{view.label}</span>
    </span>
  )
}
