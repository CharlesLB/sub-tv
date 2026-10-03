import { describe, expect, it } from 'vitest'
import { countGoalsBySide, resolveNarratedScore, type ScoredEvent } from './season-statistics'

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

const FMF_MATCH_ID = 4321
const TOOL_MATCH = { sumulaProcessedAt: null, fmfMatchId: null }
const FMF_MATCH = { sumulaProcessedAt: null, fmfMatchId: FMF_MATCH_ID }

describe('resolveNarratedScore', () => {
  it('derives the score from events when the match was narrated and has no súmula', () => {
    expect(resolveNarratedScore(FMF_MATCH, [event({ side: 'away' }), event({ side: 'away' })])).toEqual({ homeScore: 0, awayScore: 2 })
  })

  it('keeps the official FMF score of a match that already has a processed súmula', () => {
    expect(resolveNarratedScore({ sumulaProcessedAt: new Date(), fmfMatchId: FMF_MATCH_ID }, [event({ side: 'home' })])).toBeNull()
  })

  it('leaves an FMF match untouched when only FMF events exist', () => {
    expect(resolveNarratedScore(FMF_MATCH, [event({ source: 'fmf' })])).toBeNull()
  })

  it('returns zero to zero when a narrated match only has cards', () => {
    expect(resolveNarratedScore(FMF_MATCH, [event({ type: 'amarelo' })])).toEqual({ homeScore: 0, awayScore: 0 })
  })

  it('returns zero to zero for a match created in the tool that ended without any event', () => {
    expect(resolveNarratedScore(TOOL_MATCH, [])).toEqual({ homeScore: 0, awayScore: 0 })
  })

  it('leaves an FMF match without any event to the official result', () => {
    expect(resolveNarratedScore(FMF_MATCH, [])).toBeNull()
  })
})
