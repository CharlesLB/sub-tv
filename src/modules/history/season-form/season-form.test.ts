import { describe, expect, it } from 'vitest'
import { buildFormByYear, type FinishedTeamMatch } from './season-form'

const TEAM = 'team-a'
const OPPONENT = 'team-b'

const match = (year: number, homeTeamId: string, homeScore: number, awayScore: number): FinishedTeamMatch => ({
  year,
  homeTeamId,
  awayTeamId: homeTeamId === TEAM ? OPPONENT : TEAM,
  homeScore,
  awayScore,
})

describe('buildFormByYear', () => {
  it('buildFormByYear with home and away games returns the results from the team point of view', () => {
    const matches = [match(2024, TEAM, 2, 0), match(2024, OPPONENT, 3, 1), match(2024, OPPONENT, 1, 1)]

    const form = buildFormByYear(matches, new Set([TEAM]))

    expect(form[2024]).toEqual(['V', 'D', 'E'])
  })

  it('buildFormByYear with more than five games keeps only the last five of each year', () => {
    const matches = [match(2025, TEAM, 0, 1), ...Array.from({ length: 5 }, () => match(2025, TEAM, 1, 0)), match(2026, TEAM, 0, 0)]

    const form = buildFormByYear(matches, new Set([TEAM]))

    expect(form[2025]).toEqual(['V', 'V', 'V', 'V', 'V'])
    expect(form[2026]).toEqual(['E'])
  })
})
