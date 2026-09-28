import * as R from 'remeda'
import { describe, expect, it } from 'vitest'
import type { MatchSetupVM, SetupTeamVM } from '../types'
import { createInitialWizardState, LINEUP_VIEW, WIZARD_STEP, wizardReducer } from './wizard-reducer'

const teamOf = (seasonTeamId: string, abbreviation: string): SetupTeamVM => {
  const players = R.range(1, 15).map((shirtNumber) => ({ playerId: `${seasonTeamId}-${shirtNumber}`, shirtNumber, name: `Atleta ${shirtNumber}`, nickname: null, position: null }))

  return { seasonTeamId, name: abbreviation, abbreviation, color: '#123456', players, defaultStarterIds: players.slice(0, 11).map((player) => player.playerId) }
}

const setupOf = (overrides: Partial<MatchSetupVM> = {}): MatchSetupVM => ({
  championship: { id: 'season', name: 'Mineiro', category: 'sub14', year: 2026, currentRound: 7 },
  teams: [teamOf('alpha', 'ALF'), teamOf('beta', 'BET'), teamOf('gamma', 'GAM')],
  prefill: null,
  ...overrides,
})

const initialOf = () => createInitialWizardState({ setup: setupOf(), defaultLineupView: LINEUP_VIEW.FIELD })

describe('wizardReducer', () => {
  it('createInitialWizardState without prefill preselects the first two teams, their starters and the current round', () => {
    const state = initialOf()

    expect(state).toMatchObject({ step: 1, date: null, time: '10:00', round: '7', venue: '', homeTeamId: 'alpha', awayTeamId: 'beta' })
    expect(state.homeStarterIds).toHaveLength(11)
  })

  it('createInitialWizardState with a prefill match copies its date, teams and venue', () => {
    const prefill = { matchId: 'match', kickoffDate: '2026-10-03', kickoffTime: '09:00', round: 4, venue: 'Toca', homeSeasonTeamId: 'gamma', awaySeasonTeamId: 'alpha' }
    const state = createInitialWizardState({ setup: setupOf({ prefill }), defaultLineupView: LINEUP_VIEW.LIST })

    expect(state).toMatchObject({ date: '2026-10-03', time: '09:00', round: '4', venue: 'Toca', homeTeamId: 'gamma', awayTeamId: 'alpha' })
  })

  it('team/picked with the team already chosen by the other side keeps the state', () => {
    const state = initialOf()

    const next = wizardReducer(state, { type: 'team/picked', side: 'home', team: teamOf('beta', 'BET') })

    expect(next).toBe(state)
  })

  it('team/picked with a free team replaces that side and its starters', () => {
    const state = initialOf()

    const next = wizardReducer(state, { type: 'team/picked', side: 'away', team: teamOf('gamma', 'GAM') })

    expect(next.awayTeamId).toBe('gamma')
    expect(next.awayStarterIds).toContain('gamma-1')
    expect(next.awayPositions['gamma-1']).toEqual({ x: 94, y: 50 })
  })

  it('starter/toggled on a full lineup ignores a new player but removes a starter', () => {
    const state = initialOf()

    const ignored = wizardReducer(state, { type: 'starter/toggled', side: 'home', playerId: 'alpha-12' })
    const removed = wizardReducer(state, { type: 'starter/toggled', side: 'home', playerId: 'alpha-1' })

    expect(ignored.homeStarterIds).toHaveLength(11)
    expect(removed.homeStarterIds).not.toContain('alpha-1')
  })

  it('step/went-back-to only moves to an earlier step', () => {
    const atLineups = { ...initialOf(), step: WIZARD_STEP.LINEUPS }

    expect(wizardReducer(atLineups, { type: 'step/went-back-to', step: WIZARD_STEP.INFORMATION }).step).toBe(1)
    expect(wizardReducer(atLineups, { type: 'step/went-back-to', step: WIZARD_STEP.REVIEW }).step).toBe(3)
  })

  it('step/advanced and step/returned move one step and stop at the ends', () => {
    const state = initialOf()

    expect(wizardReducer(state, { type: 'step/advanced' }).step).toBe(2)
    expect(wizardReducer(state, { type: 'step/returned' }).step).toBe(1)
    expect(wizardReducer({ ...state, step: WIZARD_STEP.REVIEW }, { type: 'step/advanced' }).step).toBe(4)
  })

  it('field/changed and summary/toggled update only their slice', () => {
    const state = initialOf()

    const next = wizardReducer(wizardReducer(state, { type: 'field/changed', field: 'venue', value: 'Arena' }), { type: 'summary/toggled' })

    expect(next.venue).toBe('Arena')
    expect(next.isSummaryOpen).toBe(true)
  })

  it('createInitialWizardState seeds a pitch position for every default starter and keeps the chosen view', () => {
    const state = initialOf()

    expect(Object.keys(state.homePositions)).toHaveLength(11)
    expect(state.homePositions['alpha-1']).toEqual({ x: 6, y: 50 })
    expect(state.lineupView).toBe('field')
  })

  it('starter/moved stores the new point only for a starter', () => {
    const state = initialOf()

    const moved = wizardReducer(state, { type: 'starter/moved', side: 'home', playerId: 'alpha-9', point: { x: 40, y: 20 } })
    const ignored = wizardReducer(state, { type: 'starter/moved', side: 'home', playerId: 'alpha-13', point: { x: 40, y: 20 } })

    expect(moved.homePositions['alpha-9']).toEqual({ x: 40, y: 20 })
    expect(ignored).toBe(state)
  })

  it('starter/benched removes the starter and its position', () => {
    const next = wizardReducer(initialOf(), { type: 'starter/benched', side: 'away', playerId: 'beta-4' })

    expect(next.awayStarterIds).not.toContain('beta-4')
    expect(next.awayPositions['beta-4']).toBeUndefined()
  })

  it('reserve/swapped puts the reserve in the starter slot and inherits its point', () => {
    const state = initialOf()

    const next = wizardReducer(state, { type: 'reserve/swapped', side: 'home', reserveId: 'alpha-12', starterId: 'alpha-7', point: { x: 30, y: 40 } })

    expect(next.homeStarterIds.indexOf('alpha-12')).toBe(state.homeStarterIds.indexOf('alpha-7'))
    expect(next.homeStarterIds).not.toContain('alpha-7')
    expect(next.homePositions['alpha-12']).toEqual({ x: 30, y: 40 })
    expect(next.homePositions['alpha-7']).toBeUndefined()
  })

  it('reserve/placed adds the reserve at the dropped point only while the lineup has fewer than eleven', () => {
    const benched = wizardReducer(initialOf(), { type: 'starter/benched', side: 'home', playerId: 'alpha-2' })

    const placed = wizardReducer(benched, { type: 'reserve/placed', side: 'home', playerId: 'alpha-13', point: { x: 20, y: 70 } })
    const refused = wizardReducer(placed, { type: 'reserve/placed', side: 'home', playerId: 'alpha-14', point: null })

    expect(placed.homePositions['alpha-13']).toEqual({ x: 20, y: 70 })
    expect(refused).toBe(placed)
  })

  it('view/changed switches between list and field', () => {
    expect(wizardReducer(initialOf(), { type: 'view/changed', view: LINEUP_VIEW.LIST }).lineupView).toBe('list')
  })
})
