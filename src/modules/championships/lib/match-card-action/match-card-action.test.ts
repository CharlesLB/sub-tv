import { describe, expect, it } from 'vitest'
import { routes } from '@/lib/routes'
import { finishedMatchFixture, liveMatchFixture, penaltiesMatchFixture, SEASON_ID_FIXTURE, scheduledMatchFixture } from '../../components/match-card/match-card.fixtures'
import { MATCH_CARD_ACTION, MATCH_SIDE, matchCardActionOf, winnerOf } from './match-card-action'

describe('winnerOf', () => {
  it('returns the home side when the home team scored more', () => {
    expect(winnerOf(finishedMatchFixture)).toBe(MATCH_SIDE.HOME)
  })

  it('returns the away side when the away team scored more', () => {
    expect(winnerOf(liveMatchFixture)).toBe(MATCH_SIDE.AWAY)
  })

  it('returns no winner for a draw', () => {
    expect(winnerOf(penaltiesMatchFixture)).toBeNull()
  })

  it('returns no winner before there is a score', () => {
    expect(winnerOf(scheduledMatchFixture)).toBeNull()
  })
})

describe('matchCardActionOf', () => {
  it('offers to view a finished match as a secondary action', () => {
    expect(matchCardActionOf(finishedMatchFixture, SEASON_ID_FIXTURE)).toEqual({ kind: MATCH_CARD_ACTION.VIEW, href: routes.live(finishedMatchFixture.id), isPrimary: false })
  })

  it('offers to enter a broadcast match as the primary action', () => {
    expect(matchCardActionOf(liveMatchFixture, SEASON_ID_FIXTURE)).toEqual({ kind: MATCH_CARD_ACTION.ENTER_BROADCAST, href: routes.live(liveMatchFixture.id), isPrimary: true })
  })

  it('offers to narrate a match that is not broadcast yet', () => {
    expect(matchCardActionOf(scheduledMatchFixture, SEASON_ID_FIXTURE)).toEqual({
      kind: MATCH_CARD_ACTION.NARRATE,
      href: routes.newMatch(SEASON_ID_FIXTURE, scheduledMatchFixture.id),
      isPrimary: false,
    })
  })
})
