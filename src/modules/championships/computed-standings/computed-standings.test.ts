import { describe, expect, it } from 'vitest'
import { rankWithinGroups } from './computed-standings'

const standing = (name: string, groupName: string | null, points: number, wins: number, goalsFor: number, goalsAgainst: number) => ({ name, groupName, points, wins, goalsFor, goalsAgainst })

describe('rankWithinGroups', () => {
  it('numbers positions from one inside each group', () => {
    const ranked = rankWithinGroups([standing('A1', 'A', 9, 3, 6, 1), standing('B1', 'B', 7, 2, 5, 2), standing('A2', 'A', 4, 1, 3, 3), standing('B2', 'B', 3, 1, 2, 4)])

    expect(ranked.map((row) => [row.name, row.position])).toEqual([
      ['A1', 1],
      ['A2', 2],
      ['B1', 1],
      ['B2', 2],
    ])
  })

  it('breaks ties on points and wins by goal difference and then goals scored', () => {
    const ranked = rankWithinGroups([standing('fewer goals', null, 6, 2, 3, 1), standing('worse difference', null, 6, 2, 8, 7), standing('more goals', null, 6, 2, 5, 3)])

    expect(ranked.map((row) => row.name)).toEqual(['more goals', 'fewer goals', 'worse difference'])
  })
})
