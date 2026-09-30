import { describe, expect, it, vi } from 'vitest'
import { INITIAL_LIVE_CLOCK, MATCH_PERIOD } from '@/modules/matches/client'
import { CHRONO_TONE, chronoDisplayOf, formatElapsed } from './chrono-display'

vi.mock('@/modules/matches/client', async () => ({
  ...(await vi.importActual('@/modules/matches/lib/live-match/live-match')),
  ...(await vi.importActual('@/modules/matches/lib/live-clock/live-clock')),
}))

describe('chrono display', () => {
  it('clock before kickoff invites to start the first half', () => {
    expect(chronoDisplayOf(INITIAL_LIVE_CLOCK)).toMatchObject({ halfLabel: '1ºT', call: 'Iniciar', icon: 'playArrow', tone: CHRONO_TONE.START })
  })

  it('running first half shows the pause action in amber', () => {
    const clock = { ...INITIAL_LIVE_CLOCK, period: MATCH_PERIOD.FIRST_HALF, running: true, startedAt: '2026-09-19T13:00:00.000Z' }

    expect(chronoDisplayOf(clock)).toMatchObject({ call: null, icon: 'pause', tone: CHRONO_TONE.PAUSE })
  })

  it('running second half shows the finish flag in red', () => {
    const clock = { ...INITIAL_LIVE_CLOCK, period: MATCH_PERIOD.SECOND_HALF, running: true, startedAt: '2026-09-19T14:00:00.000Z' }

    expect(chronoDisplayOf(clock)).toMatchObject({ halfLabel: '2ºT', icon: 'flag', tone: CHRONO_TONE.FINISH })
  })

  it('half time invites to start the second half', () => {
    expect(chronoDisplayOf({ ...INITIAL_LIVE_CLOCK, period: MATCH_PERIOD.HALF_TIME })).toMatchObject({ halfLabel: '2ºT', call: 'Iniciar' })
  })

  it('ended match without a recorded clock reads as closed', () => {
    expect(chronoDisplayOf({ ...INITIAL_LIVE_CLOCK, period: MATCH_PERIOD.FULL_TIME })).toMatchObject({ halfLabel: 'Fim', call: 'Encerrado', tone: CHRONO_TONE.ENDED })
  })

  it('elapsed time with added minutes is padded and suffixed', () => {
    expect(formatElapsed(754, 2)).toBe('12:34 +2')
  })
})
