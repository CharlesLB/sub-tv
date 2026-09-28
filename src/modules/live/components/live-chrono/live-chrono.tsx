'use client'

import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui/icon/icon'
import { elapsedSecondsAt, type LiveClock } from '@/modules/matches/client'
import { useClockTick } from '../../hooks/use-clock-tick'
import { CHRONO_TONE, chronoDisplayOf, formatElapsed } from '../../chrono-display/chrono-display'
import { liveChronoStyles as styles } from './live-chrono.styles'

type LiveChronoProps = { clock: LiveClock; onAdvance: () => void }

export function LiveChrono({ clock, onAdvance }: LiveChronoProps) {
  const nowMs = useClockTick(clock.running)
  const display = chronoDisplayOf(clock)
  const tone = styles.tone[display.tone]
  const isEnded = display.tone === CHRONO_TONE.ENDED
  const elapsedSeconds = nowMs === null ? clock.elapsedSeconds : elapsedSecondsAt(clock, nowMs)

  return (
    <button type="button" onClick={onAdvance} disabled={isEnded} title={display.tip} aria-label={display.tip} className={cn(styles.button, tone.border)}>
      <span className={cn(styles.half, tone.half)}>{display.halfLabel}</span>
      <span className={cn(styles.time, display.call ? styles.timeCall : styles.timeElapsed)}>
        <Icon name={display.icon} size={16} className={tone.icon} />
        <span aria-live="off">{display.call ?? formatElapsed(elapsedSeconds, clock.addedMinutes)}</span>
      </span>
    </button>
  )
}
