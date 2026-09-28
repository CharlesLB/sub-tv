import { describe, expect, it } from 'vitest'
import { type ComparableEvent, pairLiveEvents } from './live-reconciliation'

const event = (overrides: Partial<ComparableEvent>): ComparableEvent => ({ id: 'id', matchId: 'match', type: 'gol', playerId: 'player', playerOutId: null, minute: 20, ...overrides })

describe('pairLiveEvents', () => {
  it('pairs a live goal with the FMF goal of the same player within three minutes', () => {
    expect(pairLiveEvents([event({ id: 'live', minute: 18 })], [event({ id: 'fmf', minute: 21 })])).toEqual([{ liveEventId: 'live', fmfEventId: 'fmf' }])
  })

  it('does not pair different players, types or minutes too far apart', () => {
    const live = [event({ id: 'live', minute: 10 })]

    expect(pairLiveEvents(live, [event({ id: 'other-player', playerId: 'other' }), event({ id: 'card', type: 'amarelo', minute: 10 }), event({ id: 'late', minute: 14 })])).toEqual([])
  })

  it('uses each FMF event only once when the same player scored twice', () => {
    const live = [event({ id: 'first-live', minute: 10 }), event({ id: 'second-live', minute: 12 })]
    const fmf = [event({ id: 'fmf', minute: 11 })]

    expect(pairLiveEvents(live, fmf)).toEqual([{ liveEventId: 'first-live', fmfEventId: 'fmf' }])
  })

  it('pairs a substitution only when both players match', () => {
    const live = [event({ id: 'live', type: 'substituicao', playerOutId: 'out', minute: null })]

    expect(pairLiveEvents(live, [event({ id: 'fmf', type: 'substituicao', playerOutId: 'out', minute: null })])).toHaveLength(1)
    expect(pairLiveEvents(live, [event({ id: 'fmf', type: 'substituicao', playerOutId: 'another', minute: null })])).toHaveLength(0)
  })
})
