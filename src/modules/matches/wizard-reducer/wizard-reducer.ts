import * as R from 'remeda'
import { STARTERS_PER_TEAM } from '../default-starters/default-starters'
import { opponentSide, type Side } from '../live-match/live-match'
import type { PitchPoint } from '../pitch-layout/pitch-layout'
import { type StarterPositions, seedStarterPositions } from '../starter-positions/starter-positions'
import type { MatchSetupVM, SetupTeamVM } from '../types'

export const WIZARD_STEP = { INFORMATION: 1, TEAMS: 2, LINEUPS: 3, REVIEW: 4 } as const

export type WizardStep = (typeof WIZARD_STEP)[keyof typeof WIZARD_STEP]

export const WIZARD_STEPS: readonly WizardStep[] = [WIZARD_STEP.INFORMATION, WIZARD_STEP.TEAMS, WIZARD_STEP.LINEUPS, WIZARD_STEP.REVIEW]

export const LINEUP_VIEW = { LIST: 'list', FIELD: 'field' } as const

export type LineupView = (typeof LINEUP_VIEW)[keyof typeof LINEUP_VIEW]

export type InformationField = 'date' | 'time' | 'round' | 'venue'

export type WizardState = {
  step: WizardStep
  date: string | null
  time: string
  round: string
  venue: string
  homeTeamId: string | null
  awayTeamId: string | null
  homeStarterIds: string[]
  awayStarterIds: string[]
  homePositions: StarterPositions
  awayPositions: StarterPositions
  lineupView: LineupView
  isSummaryOpen: boolean
}

export type WizardInitialization = { setup: MatchSetupVM; defaultLineupView: LineupView }

export type WizardAction =
  | { type: 'field/changed'; field: InformationField; value: string }
  | { type: 'step/went-back-to'; step: WizardStep }
  | { type: 'step/advanced' }
  | { type: 'step/returned' }
  | { type: 'team/picked'; side: Side; team: SetupTeamVM }
  | { type: 'starter/toggled'; side: Side; playerId: string }
  | { type: 'view/changed'; view: LineupView }
  | { type: 'starter/moved'; side: Side; playerId: string; point: PitchPoint }
  | { type: 'starter/benched'; side: Side; playerId: string }
  | { type: 'reserve/swapped'; side: Side; reserveId: string; starterId: string; point: PitchPoint }
  | { type: 'reserve/placed'; side: Side; playerId: string; point: PitchPoint | null }
  | { type: 'summary/toggled' }

const DEFAULT_TIME = '10:00'
const FIRST_ROUND = 1

const TEAM_KEY = { home: 'homeTeamId', away: 'awayTeamId' } as const satisfies Record<Side, keyof WizardState>
const STARTERS_KEY = { home: 'homeStarterIds', away: 'awayStarterIds' } as const satisfies Record<Side, keyof WizardState>
const POSITIONS_KEY = { home: 'homePositions', away: 'awayPositions' } as const satisfies Record<Side, keyof WizardState>
const ATTACKS_RIGHT: Record<Side, boolean> = { home: true, away: false }

const nextStep: Record<WizardStep, WizardStep> = { 1: 2, 2: 3, 3: 4, 4: 4 }
const previousStep: Record<WizardStep, WizardStep> = { 1: 1, 2: 1, 3: 2, 4: 3 }

const EMPTY_POSITIONS: StarterPositions = {}

const lineupOf = (team: SetupTeamVM | undefined, side: Side): { starterIds: string[]; positions: StarterPositions } =>
  team ? { starterIds: team.defaultStarterIds, positions: seedStarterPositions(team, team.defaultStarterIds, ATTACKS_RIGHT[side]) } : { starterIds: [], positions: EMPTY_POSITIONS }

export const createInitialWizardState = ({ setup, defaultLineupView }: WizardInitialization): WizardState => {
  const { prefill, teams, championship } = setup
  const homeTeamId = prefill?.homeSeasonTeamId ?? teams[0]?.seasonTeamId ?? null
  const awayTeamId = prefill?.awaySeasonTeamId ?? teams.find((team) => team.seasonTeamId !== homeTeamId)?.seasonTeamId ?? null

  const home = lineupOf(
    teams.find((team) => team.seasonTeamId === homeTeamId),
    'home',
  )

  const away = lineupOf(
    teams.find((team) => team.seasonTeamId === awayTeamId),
    'away',
  )

  return {
    step: WIZARD_STEP.INFORMATION,
    date: prefill?.kickoffDate ?? null,
    time: prefill?.kickoffTime ?? DEFAULT_TIME,
    round: String(prefill?.round ?? championship.currentRound ?? FIRST_ROUND),
    venue: prefill?.venue ?? '',
    homeTeamId,
    awayTeamId,
    homeStarterIds: home.starterIds,
    awayStarterIds: away.starterIds,
    homePositions: home.positions,
    awayPositions: away.positions,
    lineupView: defaultLineupView,
    isSummaryOpen: false,
  }
}

const withoutKey = (positions: StarterPositions, playerId: string): StarterPositions => R.omitBy(positions, (_point, key) => key === playerId)

const benchStarter = (state: WizardState, side: Side, playerId: string): WizardState => ({
  ...state,
  [STARTERS_KEY[side]]: state[STARTERS_KEY[side]].filter((starterId) => starterId !== playerId),
  [POSITIONS_KEY[side]]: withoutKey(state[POSITIONS_KEY[side]], playerId),
})

const addStarter = (state: WizardState, side: Side, playerId: string, point: PitchPoint | null): WizardState => {
  const starterIds = state[STARTERS_KEY[side]]
  if (starterIds.includes(playerId) || starterIds.length >= STARTERS_PER_TEAM) return state
  const positions = state[POSITIONS_KEY[side]]

  return { ...state, [STARTERS_KEY[side]]: [...starterIds, playerId], [POSITIONS_KEY[side]]: point ? { ...positions, [playerId]: point } : positions }
}

const swapReserve = (state: WizardState, action: Extract<WizardAction, { type: 'reserve/swapped' }>): WizardState => {
  const starterIds = state[STARTERS_KEY[action.side]]
  if (!starterIds.includes(action.starterId) || starterIds.includes(action.reserveId)) return state

  return {
    ...state,
    [STARTERS_KEY[action.side]]: starterIds.map((starterId) => (starterId === action.starterId ? action.reserveId : starterId)),
    [POSITIONS_KEY[action.side]]: { ...withoutKey(state[POSITIONS_KEY[action.side]], action.starterId), [action.reserveId]: action.point },
  }
}

const toggleStarter = (state: WizardState, side: Side, playerId: string): WizardState =>
  state[STARTERS_KEY[side]].includes(playerId) ? benchStarter(state, side, playerId) : addStarter(state, side, playerId, null)

export const wizardReducer = (state: WizardState, action: WizardAction): WizardState => {
  switch (action.type) {
    case 'field/changed':
      return { ...state, [action.field]: action.value }
    case 'step/went-back-to':
      return action.step < state.step ? { ...state, step: action.step } : state
    case 'step/advanced':
      return { ...state, step: nextStep[state.step] }
    case 'step/returned':
      return { ...state, step: previousStep[state.step] }

    case 'team/picked': {
      const otherSide = opponentSide[action.side]
      const teamId = action.team.seasonTeamId
      if (state[TEAM_KEY[otherSide]] === teamId || state[TEAM_KEY[action.side]] === teamId) return state
      const lineup = lineupOf(action.team, action.side)

      return { ...state, [TEAM_KEY[action.side]]: teamId, [STARTERS_KEY[action.side]]: lineup.starterIds, [POSITIONS_KEY[action.side]]: lineup.positions }
    }

    case 'starter/toggled':
      return toggleStarter(state, action.side, action.playerId)
    case 'view/changed':
      return { ...state, lineupView: action.view }
    case 'starter/moved':
      return state[STARTERS_KEY[action.side]].includes(action.playerId) ? { ...state, [POSITIONS_KEY[action.side]]: { ...state[POSITIONS_KEY[action.side]], [action.playerId]: action.point } } : state
    case 'starter/benched':
      return benchStarter(state, action.side, action.playerId)
    case 'reserve/swapped':
      return swapReserve(state, action)
    case 'reserve/placed':
      return addStarter(state, action.side, action.playerId, action.point)
    case 'summary/toggled':
      return { ...state, isSummaryOpen: !state.isSummaryOpen }
  }
}
