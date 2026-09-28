import type { PlayerMatchState } from '../../state/live-state'

export const HIGHLIGHT_TONE = { GOAL: 'goal', ASSIST: 'assist', YELLOW: 'yellow', RED: 'red', IN: 'in', OUT: 'out' } as const

export type HighlightTone = (typeof HIGHLIGHT_TONE)[keyof typeof HIGHLIGHT_TONE]

export type MatchHighlight = { text: string; tone: HighlightTone; isCard: boolean }

const cardHighlight = (state: PlayerMatchState): MatchHighlight[] => {
  if (state.sentOff && state.sentOffBySecondYellow) return [{ text: 'Expulso (2º amarelo)', tone: HIGHLIGHT_TONE.RED, isCard: true }]
  if (state.sentOff) return [{ text: 'Vermelho', tone: HIGHLIGHT_TONE.RED, isCard: true }]
  if (state.yellowCards > 1) return [{ text: `${state.yellowCards} Amarelos`, tone: HIGHLIGHT_TONE.YELLOW, isCard: true }]

  return state.yellowCards === 1 ? [{ text: 'Amarelo', tone: HIGHLIGHT_TONE.YELLOW, isCard: true }] : []
}

const substitutionHighlight = (state: PlayerMatchState): MatchHighlight[] => {
  if (state.subbedOut) return [{ text: 'Substituído', tone: HIGHLIGHT_TONE.OUT, isCard: false }]

  return state.subbedIn ? [{ text: 'Entrou em campo', tone: HIGHLIGHT_TONE.IN, isCard: false }] : []
}

export const matchHighlightsOf = (state: PlayerMatchState): MatchHighlight[] => [
  ...(state.goals > 0 ? [{ text: state.goals > 1 ? `${state.goals} Gols` : 'Gol', tone: HIGHLIGHT_TONE.GOAL, isCard: false }] : []),
  ...(state.assists > 0 ? [{ text: state.assists > 1 ? `${state.assists} Assistências` : 'Assistência', tone: HIGHLIGHT_TONE.ASSIST, isCard: false }] : []),
  ...cardHighlight(state),
  ...substitutionHighlight(state),
]
