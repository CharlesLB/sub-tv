import * as R from 'remeda'
import { describe, expect, it } from 'vitest'
import type { SetupTeamVM } from '../types'
import { resolveStarterPositions, seedStarterPositions } from './starter-positions'

const team: SetupTeamVM = {
  seasonTeamId: 'team',
  name: 'Time',
  abbreviation: 'TIM',
  color: '#123456',
  players: R.range(1, 15).map((shirtNumber) => ({ playerId: `p${shirtNumber}`, shirtNumber, name: `Atleta ${shirtNumber}`, nickname: null, position: null })),
  defaultStarterIds: [],
}
const eleven = R.range(1, 12).map((shirtNumber) => `p${shirtNumber}`)

describe('starter-positions', () => {
  it('seedStarterPositions places every starter with the classic layout', () => {
    const positions = seedStarterPositions(team, eleven, true)

    expect(Object.keys(positions)).toHaveLength(11)
    expect(positions.p1).toEqual({ x: 6, y: 50 })
  })

  it('resolveStarterPositions keeps saved coordinates untouched', () => {
    const saved = { ...seedStarterPositions(team, eleven, true), p9: { x: 70, y: 30 } }

    expect(resolveStarterPositions(team, eleven, saved, true).p9).toEqual({ x: 70, y: 30 })
  })

  it('resolveStarterPositions gives a newcomer a free slot that does not overlap anyone', () => {
    const withoutNine = eleven.filter((playerId) => playerId !== 'p9')
    const saved = seedStarterPositions(team, withoutNine, true)
    const positions = resolveStarterPositions(team, [...withoutNine, 'p12'], saved, true)
    const newcomer = positions.p12

    expect(newcomer).toBeDefined()
    expect(withoutNine.every((playerId) => positions[playerId] === saved[playerId])).toBe(true)
    expect(withoutNine.some((playerId) => positions[playerId]?.x === newcomer?.x && positions[playerId]?.y === newcomer?.y)).toBe(false)
  })

  it('resolveStarterPositions ignores saved coordinates of players no longer starting', () => {
    const positions = resolveStarterPositions(team, ['p1'], { p5: { x: 20, y: 20 } }, false)

    expect(Object.keys(positions)).toEqual(['p1'])
  })
})
