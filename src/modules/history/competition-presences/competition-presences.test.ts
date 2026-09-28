import { describe, expect, it } from 'vitest'
import { countCompetitionPresences } from './competition-presences'

describe('countCompetitionPresences', () => {
  it('countCompetitionPresences with repeated competitions counts seasons per competition, most frequent first', () => {
    const seasons = [{ championships: ['Mineiro 1ª Divisão'] }, { championships: ['Mineiro 1ª Divisão', 'Troféu Inconfidência'] }, { championships: ['Copa'] }]

    const presences = countCompetitionPresences(seasons)

    expect(presences).toEqual([
      { name: 'Mineiro 1ª Divisão', seasonCount: 2 },
      { name: 'Copa', seasonCount: 1 },
      { name: 'Troféu Inconfidência', seasonCount: 1 },
    ])
  })

  it('countCompetitionPresences without seasons returns an empty list', () => {
    expect(countCompetitionPresences([])).toEqual([])
  })
})
