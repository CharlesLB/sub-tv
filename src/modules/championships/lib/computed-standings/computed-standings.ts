import * as R from 'remeda'

export type RankableStanding = { groupName: string | null; points: number; wins: number; goalsFor: number; goalsAgainst: number }

const NO_GROUP = ''

export const rankWithinGroups = <Standing extends RankableStanding>(standings: Standing[]): (Standing & { position: number })[] =>
  R.pipe(
    standings,
    R.groupBy((standing) => standing.groupName ?? NO_GROUP),
    R.values(),
    R.flatMap((groupStandings) =>
      R.sortBy(
        groupStandings,
        [(standing) => standing.points, 'desc'],
        [(standing) => standing.wins, 'desc'],
        [(standing) => standing.goalsFor - standing.goalsAgainst, 'desc'],
        [(standing) => standing.goalsFor, 'desc'],
      ).map((standing, index) => ({ ...standing, position: index + 1 })),
    ),
  )
