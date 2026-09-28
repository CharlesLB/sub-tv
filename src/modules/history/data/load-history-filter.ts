import 'server-only'
import { CATEGORY_PARAMETER, SEASONS_PARAMETER } from '@/lib/routes'
import { getSeasonYears } from '@/modules/championships'
import { describeSeasonSelection, parseHistoryFilter, type HistoryFilter } from '../history-filter/history-filter'

export type HistoryQuery = Record<string, string | string[] | undefined>

export type LoadedHistoryFilter = { filter: HistoryFilter; availableYears: number[]; seasonLabel: string }

export const loadHistoryFilter = async (query: HistoryQuery): Promise<LoadedHistoryFilter> => {
  const availableYears = (await getSeasonYears()).map((seasonYear) => seasonYear.year)
  const filter = parseHistoryFilter({ category: query[CATEGORY_PARAMETER], years: query[SEASONS_PARAMETER] }, availableYears)

  return { filter, availableYears, seasonLabel: describeSeasonSelection(filter.years, availableYears) }
}
