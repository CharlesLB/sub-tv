import * as R from 'remeda'

export const STARTERS_PER_TEAM = 11

export type StarterCandidate = { playerId: string; shirtNumber: number; starts: number }

export const pickDefaultStarters = (candidates: StarterCandidate[]): string[] => {
  const hasStartHistory = candidates.some((candidate) => candidate.starts > 0)

  const chosen = new Set(
    R.pipe(
      candidates,
      R.sortBy(hasStartHistory ? [(candidate) => candidate.starts, 'desc'] : (candidate) => candidate.shirtNumber, (candidate) => candidate.shirtNumber),
      R.take(STARTERS_PER_TEAM),
      R.map((candidate) => candidate.playerId),
    ),
  )

  return candidates.filter((candidate) => chosen.has(candidate.playerId)).map((candidate) => candidate.playerId)
}
