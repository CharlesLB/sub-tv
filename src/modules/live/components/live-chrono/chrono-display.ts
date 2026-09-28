import type { IconName } from '@/components/ui/icon/icon-paths'
import { type LiveClock, MATCH_PERIOD } from '@/modules/matches/client'

const SECONDS_PER_MINUTE = 60
const TWO_DIGITS = 2

export const CHRONO_TONE = { START: 'start', PAUSE: 'pause', FINISH: 'finish', ENDED: 'ended' } as const

export type ChronoTone = (typeof CHRONO_TONE)[keyof typeof CHRONO_TONE]

export type ChronoDisplay = { halfLabel: string; call: string | null; icon: IconName; tone: ChronoTone; tip: string }

const HALF_LABEL = { FIRST: '1ºT', SECOND: '2ºT', ENDED: 'Fim' } as const

const START_CALL = 'Iniciar'
const RESUME_CALL = 'Retomar'
const ENDED_CALL = 'Encerrado'

export const chronoDisplayOf = (clock: LiveClock): ChronoDisplay => {
  if (clock.period === MATCH_PERIOD.FULL_TIME) {
    return { halfLabel: HALF_LABEL.ENDED, call: clock.elapsedSeconds > 0 ? null : ENDED_CALL, icon: 'flag', tone: CHRONO_TONE.ENDED, tip: 'Jogo encerrado' }
  }

  if (clock.period === MATCH_PERIOD.BEFORE_START) {
    return { halfLabel: HALF_LABEL.FIRST, call: START_CALL, icon: 'playArrow', tone: CHRONO_TONE.START, tip: 'Clique para iniciar a partida' }
  }

  if (clock.period === MATCH_PERIOD.HALF_TIME) {
    return { halfLabel: HALF_LABEL.SECOND, call: START_CALL, icon: 'playArrow', tone: CHRONO_TONE.START, tip: 'Clique para iniciar o 2º tempo' }
  }

  const isFirstHalf = clock.period === MATCH_PERIOD.FIRST_HALF
  const halfLabel = isFirstHalf ? HALF_LABEL.FIRST : HALF_LABEL.SECOND

  if (!clock.running) {
    return isFirstHalf
      ? { halfLabel, call: RESUME_CALL, icon: 'playArrow', tone: CHRONO_TONE.START, tip: 'Clique para retomar o 1º tempo' }
      : { halfLabel, call: START_CALL, icon: 'playArrow', tone: CHRONO_TONE.START, tip: 'Clique para iniciar o 2º tempo' }
  }

  return isFirstHalf
    ? { halfLabel, call: null, icon: 'pause', tone: CHRONO_TONE.PAUSE, tip: 'Clique para ir ao intervalo' }
    : { halfLabel, call: null, icon: 'flag', tone: CHRONO_TONE.FINISH, tip: 'Clique para encerrar a partida' }
}

export const formatElapsed = (elapsedSeconds: number, addedMinutes: number): string => {
  const minutes = String(Math.floor(elapsedSeconds / SECONDS_PER_MINUTE)).padStart(TWO_DIGITS, '0')
  const seconds = String(elapsedSeconds % SECONDS_PER_MINUTE).padStart(TWO_DIGITS, '0')

  return `${minutes}:${seconds}${addedMinutes > 0 ? ` +${addedMinutes}` : ''}`
}
