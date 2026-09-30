import * as R from 'remeda'
import { type Category, isCategory } from '@/modules/championships/client'

export type HistoryFilter = { category: Category | null; years: number[] }

export type HistoryRouteQuery = { category?: string | undefined; years?: string | undefined }

type SearchParamValue = string | string[] | undefined

const YEAR_SEPARATOR = ','
const ALL_SEASONS_LABEL = 'Todas as temporadas'

const firstValue = (value: SearchParamValue): string | undefined => (Array.isArray(value) ? value[0] : value)

const sortDescending = (years: readonly number[]): number[] => R.sortBy([...years], [(year) => year, 'desc'])

export const normalizeYears = (requestedYears: readonly number[], availableYears: readonly number[]): number[] => {
  const knownYears = sortDescending(R.unique(requestedYears.filter((year) => availableYears.includes(year))))

  return knownYears.length === R.unique(availableYears).length ? [] : knownYears
}

export const parseHistoryFilter = (query: { category: SearchParamValue; years: SearchParamValue }, availableYears: readonly number[]): HistoryFilter => {
  const categoryValue = firstValue(query.category)

  const requestedYears = (firstValue(query.years) ?? '')
    .split(YEAR_SEPARATOR)
    .filter((part) => part.trim() !== '')
    .map(Number)

  return {
    category: isCategory(categoryValue) ? categoryValue : null,
    years: normalizeYears(requestedYears, availableYears),
  }
}

export const toggleSeasonYear = (selectedYears: readonly number[], year: number, availableYears: readonly number[]): number[] => {
  if (selectedYears.length === 0) return [year]

  const toggledYears = selectedYears.includes(year) ? selectedYears.filter((selectedYear) => selectedYear !== year) : [...selectedYears, year]

  return normalizeYears(toggledYears, availableYears)
}

export const toHistoryRouteQuery = (filter: HistoryFilter): HistoryRouteQuery => ({
  category: filter.category ?? undefined,
  years: filter.years.length > 0 ? filter.years.join(YEAR_SEPARATOR) : undefined,
})

export const describeSeasonSelection = (selectedYears: readonly number[], availableYears: readonly number[]): string => {
  const listedYears = sortDescending(selectedYears.length > 0 ? selectedYears : availableYears)
  const newestYear = R.first(listedYears)
  const oldestYear = R.last(listedYears)
  const span = newestYear !== undefined && oldestYear !== undefined ? `${oldestYear}–${newestYear}` : null

  if (selectedYears.length === 0) return span ? `${ALL_SEASONS_LABEL} · ${span}` : ALL_SEASONS_LABEL
  if (listedYears.length === 1) return `Temporada ${newestYear}`

  return `${listedYears.length} Temporadas · ${span}`
}
