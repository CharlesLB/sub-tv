import type { Crumb } from '@/modules/platform'
import type { HistoryFilter } from '../history-filter/history-filter'
import { type HistoryTarget, historyHref } from '../history-href/history-href'

const HISTORY_LABEL = 'Histórico'
const SEASON_SEPARATOR = '·'
const OVERVIEW_TARGET = { kind: 'overview' } as const

export const historyCrumbs = (target: HistoryTarget, filter: HistoryFilter, seasonLabel: string, pageLabel: string | null): Crumb[] => {
  const historyCrumb: Crumb = pageLabel ? { label: HISTORY_LABEL, href: historyHref(OVERVIEW_TARGET, filter) } : { label: HISTORY_LABEL }
  const pageCrumbs: Crumb[] = pageLabel ? [{ label: pageLabel }] : []

  const seasonCrumb: Crumb =
    filter.years.length > 0 ? { label: seasonLabel, separator: SEASON_SEPARATOR, href: historyHref(target, { ...filter, years: [] }) } : { label: seasonLabel, separator: SEASON_SEPARATOR }

  return [historyCrumb, ...pageCrumbs, seasonCrumb]
}
