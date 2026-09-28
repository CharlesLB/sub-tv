'use client'

import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui/icon/icon'
import { elapsedSecondsAt, type LiveClock } from '@/modules/matches/client'
import { useClockTick } from '../../hooks/use-clock-tick'
import { CHRONO_TONE, type ChronoTone, chronoDisplayOf, formatElapsed } from './chrono-display'

const TONE_CLASS: Record<ChronoTone, { border: string; half: string; icon: string }> = {
  [CHRONO_TONE.START]: { border: 'border-ac', half: 'bg-ac/15 text-ac', icon: 'text-ac' },
  [CHRONO_TONE.PAUSE]: { border: 'border-am', half: 'bg-am/15 text-am', icon: 'text-am' },
  [CHRONO_TONE.FINISH]: { border: 'border-vm', half: 'bg-vm/15 text-vm', icon: 'text-vm' },
  [CHRONO_TONE.ENDED]: { border: 'border-bd2', half: 'bg-bd text-tx3', icon: 'text-tx4' },
}

type LiveChronoProps = { clock: LiveClock; onAdvance: () => void }

export function LiveChrono({ clock, onAdvance }: LiveChronoProps) {
  const nowMs = useClockTick(clock.running)
  const display = chronoDisplayOf(clock)
  const tone = TONE_CLASS[display.tone]
  const isEnded = display.tone === CHRONO_TONE.ENDED
  const elapsedSeconds = nowMs === null ? clock.elapsedSeconds : elapsedSecondsAt(clock, nowMs)

  return (
    <button
      type="button"
      onClick={onAdvance}
      disabled={isEnded}
      title={display.tip}
      aria-label={display.tip}
      className={cn(
        'flex skew-x-12 items-stretch overflow-hidden rounded-card border bg-transparent p-0 whitespace-nowrap text-tx transition-colors duration-150 hover:border-tx disabled:cursor-default disabled:hover:border-bd2',
        tone.border,
      )}
    >
      <span className={cn('flex items-center px-[11px] text-[11.3px] font-bold tracking-[-.01em]', tone.half)}>{display.halfLabel}</span>
      <span className={cn('flex items-center gap-[7px] px-[13px] py-[7px] font-bold nums', display.call ? 'text-[12.5px] tracking-[.14em]' : 'text-[16px] tracking-[.02em] mobile:text-[13px]')}>
        <Icon name={display.icon} size={16} className={tone.icon} />
        <span aria-live="off">{display.call ?? formatElapsed(elapsedSeconds, clock.addedMinutes)}</span>
      </span>
    </button>
  )
}
