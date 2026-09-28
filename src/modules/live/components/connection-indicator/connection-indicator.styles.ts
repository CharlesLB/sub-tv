import { STREAM_STATUS, type StreamStatus } from '../../state/live-state'

export const connectionIndicatorStyles = {
  indicator: 'flex flex-none items-center gap-[6px] text-[9.5px] font-semibold tracking-[-.01em] text-tx4',
  dot: 'size-[7px] rounded-full',
  label: 'mobile:sr-only',
  statusDot: {
    [STREAM_STATUS.CONNECTING]: 'bg-bd3 animate-live-dot',
    [STREAM_STATUS.CONNECTED]: 'bg-ac2',
    [STREAM_STATUS.RECONNECTING]: 'bg-am animate-live-dot',
  } satisfies Record<StreamStatus, string>,
  savingDot: 'bg-az animate-live-dot',
} as const
