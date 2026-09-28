import type { IconName } from '@/components/ui/icon/icon-paths'
import type { PlayerMatchState } from '../../state/live-state'

export const MARK_CORNER = { TOP_LEFT: 'top-left', TOP_RIGHT: 'top-right', BOTTOM_LEFT: 'bottom-left', BOTTOM_RIGHT: 'bottom-right' } as const

export type MarkCorner = (typeof MARK_CORNER)[keyof typeof MARK_CORNER]

export const MARK_TONE = {
  GOAL: 'goal',
  ASSIST: 'assist',
  YELLOW: 'yellow',
  RED: 'red',
  SECOND_YELLOW: 'second-yellow',
  SUBBED_OUT: 'subbed-out',
  SUBBED_IN: 'subbed-in',
} as const

export type MarkTone = (typeof MARK_TONE)[keyof typeof MARK_TONE]

export type PlayerMark = { corner: MarkCorner; tone: MarkTone; isCard: boolean; icon: IconName | null; count: string | null; tip: string }

const countLabel = (count: number): string | null => (count > 1 ? String(count) : null)

const goalMark = (goals: number): PlayerMark[] =>
  goals > 0 ? [{ corner: MARK_CORNER.TOP_RIGHT, tone: MARK_TONE.GOAL, isCard: false, icon: 'sportsSoccer', count: countLabel(goals), tip: goals > 1 ? `${goals} gols` : '1 gol' }] : []

const assistMark = (assists: number): PlayerMark[] =>
  assists > 0
    ? [
        {
          corner: MARK_CORNER.TOP_LEFT,
          tone: MARK_TONE.ASSIST,
          isCard: false,
          icon: 'footprint',
          count: countLabel(assists),
          tip: assists > 1 ? `${assists} assistências` : '1 assistência',
        },
      ]
    : []

const cardMark = (state: PlayerMatchState): PlayerMark[] => {
  const card = { corner: MARK_CORNER.BOTTOM_RIGHT, isCard: true, icon: null, count: null }
  if (state.sentOff && state.sentOffBySecondYellow) return [{ ...card, tone: MARK_TONE.SECOND_YELLOW, tip: 'Expulso por 2º amarelo' }]
  if (state.sentOff) return [{ ...card, tone: MARK_TONE.RED, tip: 'Cartão vermelho direto' }]

  return state.yellowCards > 0 ? [{ ...card, tone: MARK_TONE.YELLOW, count: countLabel(state.yellowCards), tip: 'Cartão amarelo' }] : []
}

const substitutionMark = (state: PlayerMatchState): PlayerMark[] => {
  const badge = { corner: MARK_CORNER.BOTTOM_LEFT, isCard: false, count: null }
  if (state.subbedOut) return [{ ...badge, tone: MARK_TONE.SUBBED_OUT, icon: 'arrowDownward', tip: 'Substituído' }]

  return state.subbedIn ? [{ ...badge, tone: MARK_TONE.SUBBED_IN, icon: 'arrowUpward', tip: 'Entrou em campo' }] : []
}

export const marksOf = (state: PlayerMatchState): PlayerMark[] => [...goalMark(state.goals), ...assistMark(state.assists), ...cardMark(state), ...substitutionMark(state)]
