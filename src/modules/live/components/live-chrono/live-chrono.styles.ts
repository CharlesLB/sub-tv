import { CHRONO_TONE, type ChronoTone } from '../../chrono-display/chrono-display'

export const liveChronoStyles = {
  button:
    'flex skew-x-12 items-stretch overflow-hidden rounded-card border bg-transparent p-0 whitespace-nowrap text-tx transition-colors duration-150 hover:border-tx disabled:cursor-default disabled:hover:border-bd2',
  half: 'flex items-center px-[11px] text-[11.3px] font-bold tracking-[-.01em]',
  time: 'flex items-center gap-[7px] px-[13px] py-[7px] font-bold nums',
  timeCall: 'text-[12.5px] tracking-[.14em]',
  timeElapsed: 'text-[16px] tracking-[.02em] mobile:text-[13px]',
  tone: {
    [CHRONO_TONE.START]: { border: 'border-ac', half: 'bg-ac/15 text-ac', icon: 'text-ac' },
    [CHRONO_TONE.PAUSE]: { border: 'border-am', half: 'bg-am/15 text-am', icon: 'text-am' },
    [CHRONO_TONE.FINISH]: { border: 'border-vm', half: 'bg-vm/15 text-vm', icon: 'text-vm' },
    [CHRONO_TONE.ENDED]: { border: 'border-bd2', half: 'bg-bd text-tx3', icon: 'text-tx4' },
  } satisfies Record<ChronoTone, { border: string; half: string; icon: string }>,
} as const
