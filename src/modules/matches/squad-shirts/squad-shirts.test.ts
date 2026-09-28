import { describe, expect, it } from 'vitest'
import { assignShirtNumbers, type SquadShirtClaim } from './squad-shirts'

const claim = (playerId: string, usualShirtNumber: number | null, starts = 0): SquadShirtClaim => ({ playerId, usualShirtNumber, starts, name: playerId })

describe('assignShirtNumbers', () => {
  it('assignShirtNumbers with distinct usual numbers keeps every usual number', () => {
    const numbers = assignShirtNumbers([claim('ana', 1), claim('bia', 9)])

    expect(numbers).toEqual({ ana: 1, bia: 9 })
  })

  it('assignShirtNumbers with a shared number gives it to the player with more starts', () => {
    const numbers = assignShirtNumbers([claim('reserve', 10, 1), claim('starter', 10, 8), claim('keeper', 1, 8)])

    expect(numbers.starter).toBe(10)
    expect(numbers.reserve).toBe(11)
  })

  it('assignShirtNumbers with players without a number gives them unique numbers above the highest usual one', () => {
    const numbers = assignShirtNumbers([claim('ana', 5), claim('bia', null), claim('caio', null)])

    expect(numbers).toEqual({ ana: 5, bia: 6, caio: 7 })
  })

  it('assignShirtNumbers never repeats a number inside the squad', () => {
    const numbers = Object.values(assignShirtNumbers([claim('a', 3), claim('b', 3), claim('c', 4), claim('d', 4), claim('e', null)]))

    expect(new Set(numbers).size).toBe(numbers.length)
  })
})
