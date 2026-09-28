import { routes } from '@/lib/routes'
import { MATCH_STATUS } from '../match-status/match-status'
import type { MatchCardVM } from '../types'

export const MATCH_SIDE = { HOME: 'home', AWAY: 'away' } as const

export type MatchSide = (typeof MATCH_SIDE)[keyof typeof MATCH_SIDE]

export const MATCH_CARD_ACTION = { VIEW: 'view', ENTER_BROADCAST: 'enterBroadcast', NARRATE: 'narrate' } as const

export type MatchCardActionKind = (typeof MATCH_CARD_ACTION)[keyof typeof MATCH_CARD_ACTION]

export type MatchCardAction = { kind: MatchCardActionKind; href: ReturnType<typeof routes.live> | ReturnType<typeof routes.newMatch>; isPrimary: boolean }

export const winnerOf = (match: MatchCardVM): MatchSide | null => {
  if (match.homeScore === null || match.awayScore === null || match.homeScore === match.awayScore) return null

  return match.homeScore > match.awayScore ? MATCH_SIDE.HOME : MATCH_SIDE.AWAY
}

export const matchCardActionOf = (match: MatchCardVM, seasonId: string): MatchCardAction => {
  if (match.status === MATCH_STATUS.FINISHED) return { kind: MATCH_CARD_ACTION.VIEW, href: routes.live(match.id), isPrimary: false }
  if (match.isBroadcast) return { kind: MATCH_CARD_ACTION.ENTER_BROADCAST, href: routes.live(match.id), isPrimary: true }

  return { kind: MATCH_CARD_ACTION.NARRATE, href: routes.newMatch(seasonId, match.id), isPrimary: false }
}
