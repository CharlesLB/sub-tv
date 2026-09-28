import { describe, expect, it } from 'vitest'
import type { MatchSetupVM } from '../types'
import { WIZARD_STEP, type WizardState } from '../wizard-reducer/wizard-reducer'
import { canAdvance, parseRound, reviewSubtitle, stepHint, stepValues, summaryLines, toCreateInput } from './wizard-selectors'

const TODAY = '2026-09-19'

const setup: MatchSetupVM = {
  championship: { id: 'season', name: 'Mineiro', category: 'sub14', year: 2026, currentRound: 7 },
  teams: [
    { seasonTeamId: 'alpha', name: 'Alfa', abbreviation: 'ALF', color: '#111111', crestPath: null, players: [], defaultStarterIds: [] },
    { seasonTeamId: 'beta', name: 'Beta', abbreviation: 'BET', color: '#222222', crestPath: null, players: [], defaultStarterIds: [] },
  ],
  prefill: null,
}

const elevenOf = (prefix: string): string[] => Array.from({ length: 11 }, (_, index) => `${prefix}-${index}`)

const stateOf = (overrides: Partial<WizardState> = {}): WizardState => ({
  step: WIZARD_STEP.INFORMATION,
  date: null,
  time: '10:00',
  round: '7',
  venue: 'Arena',
  homeTeamId: 'alpha',
  awayTeamId: 'beta',
  homeStarterIds: elevenOf('alpha'),
  awayStarterIds: elevenOf('beta'),
  homePositions: {},
  awayPositions: {},
  lineupView: 'list',
  isSummaryOpen: false,
  ...overrides,
})

const context = { setup, today: TODAY, categoryLabel: 'SUB-14' }

describe('wizard-selectors', () => {
  it('canAdvance on the information step with a blank venue is false and the hint asks to fill every field', () => {
    const state = stateOf({ venue: ' ' })

    expect(canAdvance(state, TODAY)).toBe(false)
    expect(stepHint(state, context)).toBe('Etapa 1 de 4 — data, horário, local e rodada (PREENCHA TODOS OS CAMPOS)')
  })

  it('canAdvance on the lineups step with ten starters is false and the hint shows both counts', () => {
    const state = stateOf({ step: WIZARD_STEP.LINEUPS, homeStarterIds: elevenOf('alpha').slice(1) })

    expect(canAdvance(state, TODAY)).toBe(false)
    expect(stepHint(state, context)).toBe('Etapa 3 de 4 — monte os 11 de cada time no campo (10/11 E 11/11)')
  })

  it('stepValues with the default date shows the short date, the abbreviations and the lineup counts', () => {
    const values = stepValues(stateOf(), context)

    expect(values).toEqual({ 1: 'SÁB 19 SET · 10:00', 2: 'ALF × BET', 3: '11/11 E 11/11', 4: 'Confirmar e transmitir' })
  })

  it('parseRound accepts 1 to 99 and rejects anything else', () => {
    expect(parseRound(' 12 ')).toBe(12)
    expect(parseRound('0')).toBeNull()
    expect(parseRound('7a')).toBeNull()
  })

  it('toCreateInput without prefill sends today as the kickoff date and no existing match', () => {
    const input = toCreateInput(stateOf(), context)

    expect(input.kickoffDate).toBe(TODAY)
    expect('existingMatchId' in input).toBe(false)
  })
})

describe('wizard-selectors texts', () => {
  it('summaryLines and reviewSubtitle describe round, date, time and venue', () => {
    const state = stateOf()

    expect(summaryLines(state, context)).toEqual(['Mineiro · R7', 'SÁB 19 SET · 10:00', 'Arena', 'Tempo de jogo 2 × 30 min'])
    expect(reviewSubtitle(state, context)).toBe('Rodada 7 · SÁB 19 SET · 10:00 · Arena')
  })
})
