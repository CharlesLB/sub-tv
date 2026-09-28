import { describe, expect, it } from 'vitest'
import { describeSeasonSelection, parseHistoryFilter, toHistoryRouteQuery, toggleSeasonYear } from './history-filter'

const AVAILABLE_YEARS = [2026, 2025, 2024, 2023]

describe('parseHistoryFilter', () => {
  it('parseHistoryFilter with valid params returns the category and the known years in descending order', () => {
    const query = { category: 'sub13', years: '2024,2026,1999,2024' }

    const filter = parseHistoryFilter(query, AVAILABLE_YEARS)

    expect(filter).toEqual({ category: 'sub13', years: [2026, 2024] })
  })

  it('parseHistoryFilter with invalid category and every year selected returns the unfiltered state', () => {
    const query = { category: 'sub99', years: '2023,2024,2025,2026' }

    const filter = parseHistoryFilter(query, AVAILABLE_YEARS)

    expect(filter).toEqual({ category: null, years: [] })
  })

  it('parseHistoryFilter without params returns the unfiltered state', () => {
    const filter = parseHistoryFilter({ category: undefined, years: undefined }, AVAILABLE_YEARS)

    expect(filter).toEqual({ category: null, years: [] })
  })
})

describe('toggleSeasonYear', () => {
  it('toggleSeasonYear from all seasons isolates the clicked year', () => {
    const result = toggleSeasonYear([], 2024, AVAILABLE_YEARS)

    expect(result).toEqual([2024])
  })

  it('toggleSeasonYear with a selection adds a missing year', () => {
    const result = toggleSeasonYear([2024], 2026, AVAILABLE_YEARS)

    expect(result).toEqual([2026, 2024])
  })

  it('toggleSeasonYear removing the last selected year returns all seasons', () => {
    const result = toggleSeasonYear([2024], 2024, AVAILABLE_YEARS)

    expect(result).toEqual([])
  })

  it('toggleSeasonYear completing every year returns all seasons', () => {
    const result = toggleSeasonYear([2026, 2025, 2024], 2023, AVAILABLE_YEARS)

    expect(result).toEqual([])
  })
})

describe('describeSeasonSelection', () => {
  it('describeSeasonSelection with all seasons shows the full span', () => {
    expect(describeSeasonSelection([], AVAILABLE_YEARS)).toBe('Todas as temporadas · 2023–2026')
  })

  it('describeSeasonSelection with one year names the season', () => {
    expect(describeSeasonSelection([2024], AVAILABLE_YEARS)).toBe('Temporada 2024')
  })

  it('describeSeasonSelection with several years counts them and shows the span', () => {
    expect(describeSeasonSelection([2023, 2026], AVAILABLE_YEARS)).toBe('2 Temporadas · 2023–2026')
  })

  it('describeSeasonSelection without any season in the database omits the span', () => {
    expect(describeSeasonSelection([], [])).toBe('Todas as temporadas')
  })
})

describe('toHistoryRouteQuery', () => {
  it('toHistoryRouteQuery with a filter serializes the years comma separated', () => {
    expect(toHistoryRouteQuery({ category: 'sub14', years: [2026, 2024] })).toEqual({ category: 'sub14', years: '2026,2024' })
    expect(toHistoryRouteQuery({ category: null, years: [] })).toEqual({ category: undefined, years: undefined })
  })
})
