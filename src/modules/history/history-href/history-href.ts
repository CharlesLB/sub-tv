import { routes } from '@/lib/routes'
import { type HistoryFilter, toHistoryRouteQuery } from '../history-filter/history-filter'

export type HistoryTarget = { kind: 'overview' } | { kind: 'team'; teamKey: string } | { kind: 'athlete'; playerId: string }

export const historyHref = (target: HistoryTarget, filter: HistoryFilter) => {
  const query = toHistoryRouteQuery(filter)

  switch (target.kind) {
    case 'overview':
      return routes.history(query)
    case 'team':
      return routes.teamHistory(target.teamKey, query)
    case 'athlete':
      return routes.athleteHistory(target.playerId, query)
  }
}
