import * as R from 'remeda'

export type CompetitionPresence = { name: string; seasonCount: number }

export const countCompetitionPresences = (seasons: readonly { championships: readonly string[] }[]): CompetitionPresence[] =>
  R.pipe(
    seasons.flatMap((season) => R.unique(season.championships)),
    R.countBy((name) => name),
    R.entries(),
    R.map(([name, seasonCount]) => ({ name, seasonCount })),
    R.sortBy([(presence) => presence.seasonCount, 'desc'], (presence) => presence.name),
  )
