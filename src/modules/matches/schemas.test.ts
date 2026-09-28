import * as R from 'remeda'
import { describe, expect, it } from 'vitest'
import { CreateBroadcastMatchInput } from './schemas'

const uuidOf = (index: number): string => `00000000-0000-4000-8000-${String(index).padStart(12, '0')}`

const validInput = () => ({
  seasonId: uuidOf(900),
  kickoffDate: '2026-09-19',
  kickoffTime: '10:00',
  round: '7',
  venue: 'Arena do Vale · campo 2',
  homeSeasonTeamId: uuidOf(901),
  awaySeasonTeamId: uuidOf(902),
  homeStarterIds: R.range(1, 12).map(uuidOf),
  awayStarterIds: R.range(12, 23).map(uuidOf),
})

describe('CreateBroadcastMatchInput', () => {
  it('CreateBroadcastMatchInput with a complete wizard payload parses and coerces the round', () => {
    const result = CreateBroadcastMatchInput.safeParse(validInput())

    expect(result.success).toBe(true)
    expect(result.data?.round).toBe(7)
  })

  it('CreateBroadcastMatchInput with the same team on both sides fails', () => {
    const result = CreateBroadcastMatchInput.safeParse({ ...validInput(), awaySeasonTeamId: uuidOf(901) })

    expect(result.success).toBe(false)
  })

  it('CreateBroadcastMatchInput with ten starters fails', () => {
    const result = CreateBroadcastMatchInput.safeParse({ ...validInput(), homeStarterIds: R.range(1, 11).map(uuidOf) })

    expect(result.success).toBe(false)
  })

  it('CreateBroadcastMatchInput with a repeated starter fails', () => {
    const result = CreateBroadcastMatchInput.safeParse({ ...validInput(), homeStarterIds: [...R.range(1, 11).map(uuidOf), uuidOf(1)] })

    expect(result.success).toBe(false)
  })

  it('CreateBroadcastMatchInput with a blank venue or round out of range fails', () => {
    expect(CreateBroadcastMatchInput.safeParse({ ...validInput(), venue: '   ' }).success).toBe(false)
    expect(CreateBroadcastMatchInput.safeParse({ ...validInput(), round: '100' }).success).toBe(false)
  })

  it('CreateBroadcastMatchInput with pitch coordinates inside 0–100 parses and outside fails', () => {
    const inside = { ...validInput(), homeStarterPositions: [{ playerId: uuidOf(1), x: 12.5, y: 99 }] }
    const outside = { ...validInput(), awayStarterPositions: [{ playerId: uuidOf(12), x: 101, y: 50 }] }

    expect(CreateBroadcastMatchInput.safeParse(inside).success).toBe(true)
    expect(CreateBroadcastMatchInput.safeParse(outside).success).toBe(false)
  })
})
