import { describe, expect, it } from 'vitest'
import { type ScoredEvent, countGoalsBySide, resolveNarratedScore } from './season-statistics'

const event = (overrides: Partial<ScoredEvent>): ScoredEvent => ({
  type: 'gol',
  side: 'home',
  period: '1T',
  source: 'ao_vivo',
  deletedAt: null,
  supersededAt: null,
  ...overrides,
})

describe('countGoalsBySide', () => {
  it('counts only active goals of regular play by credited side', () => {
    const events = [
      event({ side: 'home' }),
      event({ side: 'home', deletedAt: new Date() }),
      event({ side: 'away', supersededAt: new Date() }),
      event({ side: 'away' }),
      event({ side: 'away', period: 'PEN' }),
      event({ side: 'home', type: 'amarelo' }),
    ]

    expect(countGoalsBySide(events)).toEqual({ homeScore: 1, awayScore: 1 })
  })
})

describe('resolveNarratedScore', () => {
  it('derives the score from events when the match was narrated and has no súmula', () => {
    expect(resolveNarratedScore({ sumulaProcessedAt: null }, [event({ side: 'away' }), event({ side: 'away' })])).toEqual({ homeScore: 0, awayScore: 2 })
  })

  it('keeps the official FMF score of a match that already has a processed súmula', () => {
    expect(resolveNarratedScore({ sumulaProcessedAt: new Date() }, [event({ side: 'home' })])).toBeNull()
  })

  it('leaves a match untouched when only FMF events exist', () => {
    expect(resolveNarratedScore({ sumulaProcessedAt: null }, [event({ source: 'fmf' })])).toBeNull()
  })

  it('returns zero to zero when a narrated match only has cards', () => {
    expect(resolveNarratedScore({ sumulaProcessedAt: null }, [event({ type: 'amarelo' })])).toEqual({ homeScore: 0, awayScore: 0 })
  })
})
