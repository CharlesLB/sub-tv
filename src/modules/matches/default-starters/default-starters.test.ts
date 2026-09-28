import * as R from 'remeda'
import { describe, expect, it } from 'vitest'
import { pickDefaultStarters, type StarterCandidate } from './default-starters'

const squadOf = (size: number, startsOf: (shirtNumber: number) => number = () => 0): StarterCandidate[] =>
  R.range(1, size + 1).map((shirtNumber) => ({ playerId: `player-${shirtNumber}`, shirtNumber, starts: startsOf(shirtNumber) }))

describe('pickDefaultStarters', () => {
  it('pickDefaultStarters without start history picks the first eleven shirt numbers', () => {
    const starters = pickDefaultStarters(squadOf(16))

    expect(starters).toEqual(R.range(1, 12).map((shirtNumber) => `player-${shirtNumber}`))
  })

  it('pickDefaultStarters with start history picks the eleven players who started most', () => {
    const starters = pickDefaultStarters(squadOf(16, (shirtNumber) => (shirtNumber > 5 ? 10 : 1)))

    expect(starters).toEqual(R.range(6, 17).map((shirtNumber) => `player-${shirtNumber}`))
  })

  it('pickDefaultStarters with a short squad returns everyone available', () => {
    expect(pickDefaultStarters(squadOf(4))).toHaveLength(4)
  })
})
