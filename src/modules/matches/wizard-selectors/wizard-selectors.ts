import { STARTERS_PER_TEAM } from '../default-starters/default-starters'
import { formatDateInput, isDateInput, isTimeInput } from '../kickoff-time/kickoff-time'
import { resolveStarterPositions, type StarterPositions } from '../starter-positions/starter-positions'
import type { MatchSetupVM, MatchSide, SetupPlayerVM, SetupTeamVM } from '../types'
import { WIZARD_STEP, type WizardState, type WizardStep } from '../wizard-reducer/wizard-reducer'

export const MATCH_DURATION_LABEL = '2 × 30 min'

const MAXIMUM_ROUND = 99
const ROUND_PATTERN = /^\d{1,2}$/

export type WizardContext = { setup: MatchSetupVM; today: string; categoryLabel: string }

export const effectiveDate = (state: WizardState, today: string): string => state.date ?? today

export const parseRound = (round: string): number | null => {
  const trimmed = round.trim()
  const value = Number(trimmed)

  return ROUND_PATTERN.test(trimmed) && value >= 1 && value <= MAXIMUM_ROUND ? value : null
}

export const findTeam = (setup: MatchSetupVM, teamId: string | null): SetupTeamVM | null => setup.teams.find((team) => team.seasonTeamId === teamId) ?? null

export const isInformationComplete = (state: WizardState, today: string): boolean =>
  isDateInput(effectiveDate(state, today)) && isTimeInput(state.time) && state.venue.trim().length > 0 && parseRound(state.round) !== null

export const areTeamsChosen = (state: WizardState): boolean => state.homeTeamId !== null && state.awayTeamId !== null && state.homeTeamId !== state.awayTeamId

export const areLineupsComplete = (state: WizardState): boolean => state.homeStarterIds.length === STARTERS_PER_TEAM && state.awayStarterIds.length === STARTERS_PER_TEAM

export const canAdvance = (state: WizardState, today: string): boolean => {
  const checks: Record<WizardStep, () => boolean> = {
    [WIZARD_STEP.INFORMATION]: () => isInformationComplete(state, today),
    [WIZARD_STEP.TEAMS]: () => areTeamsChosen(state),
    [WIZARD_STEP.LINEUPS]: () => areLineupsComplete(state),
    [WIZARD_STEP.REVIEW]: () => isInformationComplete(state, today) && areTeamsChosen(state) && areLineupsComplete(state),
  }

  return checks[state.step]()
}

export const displayDate = (state: WizardState, today: string): string => formatDateInput(effectiveDate(state, today))

export const lineupCountLabel = (state: WizardState): string => {
  const home = state.homeStarterIds.length
  const away = state.awayStarterIds.length

  return `${home}/${STARTERS_PER_TEAM} E ${away}/${STARTERS_PER_TEAM}`
}

export const stepValues = (state: WizardState, context: WizardContext): Record<WizardStep, string> => {
  const home = findTeam(context.setup, state.homeTeamId)
  const away = findTeam(context.setup, state.awayTeamId)
  const date = displayDate(state, context.today)

  return {
    [WIZARD_STEP.INFORMATION]: date && state.time ? `${date} · ${state.time}` : 'Data, hora e local',
    [WIZARD_STEP.TEAMS]: home && away ? `${home.abbreviation} × ${away.abbreviation}` : `Dois times ${context.categoryLabel}`,
    [WIZARD_STEP.LINEUPS]: lineupCountLabel(state),
    [WIZARD_STEP.REVIEW]: 'Confirmar e transmitir',
  }
}

export const stepHint = (state: WizardState, context: WizardContext): string => {
  const ready = canAdvance(state, context.today)

  const hints: Record<WizardStep, string> = {
    [WIZARD_STEP.INFORMATION]: `Etapa 1 de 4 — data, horário, local e rodada${ready ? '' : ' (PREENCHA TODOS OS CAMPOS)'}`,
    [WIZARD_STEP.TEAMS]: `Etapa 2 de 4 — times ${context.categoryLabel} Inscritos no campeonato`,
    [WIZARD_STEP.LINEUPS]: ready ? `Etapa 3 de 4 — escalações ${context.categoryLabel} Confirmadas` : `Etapa 3 de 4 — monte os 11 de cada time no campo (${lineupCountLabel(state)})`,
    [WIZARD_STEP.REVIEW]: 'ETAPA 4 DE 4 — CONFIRME PARA CRIAR A PARTIDA E ABRIR A TRANSMISSÃO',
  }

  return hints[state.step]
}

const SIDE_LINEUP = {
  home: { teamKey: 'homeTeamId', startersKey: 'homeStarterIds', positionsKey: 'homePositions', attacksRight: true },
  away: { teamKey: 'awayTeamId', startersKey: 'awayStarterIds', positionsKey: 'awayPositions', attacksRight: false },
} as const satisfies Record<MatchSide, { teamKey: keyof WizardState; startersKey: keyof WizardState; positionsKey: keyof WizardState; attacksRight: boolean }>

export const starterPositionsOf = (state: WizardState, setup: MatchSetupVM, side: MatchSide): StarterPositions => {
  const keys = SIDE_LINEUP[side]
  const team = findTeam(setup, state[keys.teamKey])

  return team ? resolveStarterPositions(team, state[keys.startersKey], state[keys.positionsKey], keys.attacksRight) : {}
}

const toPositionList = (positions: StarterPositions) => Object.entries(positions).map(([playerId, point]) => ({ playerId, x: point.x, y: point.y }))

export const toCreateInput = (state: WizardState, context: WizardContext) => ({
  seasonId: context.setup.championship.id,
  ...(context.setup.prefill ? { existingMatchId: context.setup.prefill.matchId } : {}),
  kickoffDate: effectiveDate(state, context.today),
  kickoffTime: state.time,
  round: state.round.trim(),
  venue: state.venue.trim(),
  homeSeasonTeamId: state.homeTeamId ?? '',
  awaySeasonTeamId: state.awayTeamId ?? '',
  homeStarterIds: state.homeStarterIds,
  awayStarterIds: state.awayStarterIds,
  homeStarterPositions: toPositionList(starterPositionsOf(state, context.setup, 'home')),
  awayStarterPositions: toPositionList(starterPositionsOf(state, context.setup, 'away')),
})

export const summaryLines = (state: WizardState, context: WizardContext): string[] => [
  `${context.setup.championship.name} · R${state.round.trim()}`,
  `${displayDate(state, context.today)} · ${state.time}`,
  state.venue.trim(),
  `Tempo de jogo ${MATCH_DURATION_LABEL}`,
]

export const reviewSubtitle = (state: WizardState, context: WizardContext): string => `Rodada ${state.round.trim()} · ${displayDate(state, context.today)} · ${state.time} · ${state.venue.trim()}`

export const informationNotice = (context: WizardContext): string =>
  `Esta partida pertence a ${context.setup.championship.name} ${context.categoryLabel}. A categoria não é escolhida aqui: ela vem do campeonato e define quais times e atletas aparecem nas próximas etapas.`

export const teamsNotice = (context: WizardContext, otherCategoryName: string): string =>
  `Somente os ${context.setup.teams.length} times inscritos em ${context.setup.championship.name} ${context.categoryLabel} aparecem nesta lista. Times ${otherCategoryName} dos mesmos clubes são entidades separadas e não entram aqui.`

export const shortNameOf = (player: SetupPlayerVM): string => player.nickname ?? player.name.split(' ')[0] ?? player.name
