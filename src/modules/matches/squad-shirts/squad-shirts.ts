import * as R from 'remeda'

export type SquadShirtClaim = { playerId: string; usualShirtNumber: number | null; starts: number; name: string }

type ShirtAssignment = { takenNumbers: ReadonlySet<number>; numbersByPlayer: Readonly<Record<string, number>> }

const EMPTY_ASSIGNMENT: ShirtAssignment = { takenNumbers: new Set(), numbersByPlayer: {} }
const UNNUMBERED_SORT_KEY = Number.MAX_SAFE_INTEGER

const claimPriority = (claims: SquadShirtClaim[]): SquadShirtClaim[] =>
  R.sortBy(
    claims,
    [(claim) => claim.starts, 'desc'],
    (claim) => claim.usualShirtNumber ?? UNNUMBERED_SORT_KEY,
    (claim) => claim.name,
  )

const assign = (assignment: ShirtAssignment, playerId: string, shirtNumber: number): ShirtAssignment => ({
  takenNumbers: new Set([...assignment.takenNumbers, shirtNumber]),
  numbersByPlayer: { ...assignment.numbersByPlayer, [playerId]: shirtNumber },
})

const firstFreeNumberFrom = (takenNumbers: ReadonlySet<number>, start: number): number =>
  R.range(start, start + takenNumbers.size + 1).find((candidate) => !takenNumbers.has(candidate)) ?? start + takenNumbers.size + 1

export const assignShirtNumbers = (claims: SquadShirtClaim[]): Record<string, number> => {
  const ordered = claimPriority(claims)

  const [keepingUsual, needingNumber] = R.partition(
    ordered,
    (claim, index) => claim.usualShirtNumber !== null && ordered.findIndex((other) => other.usualShirtNumber === claim.usualShirtNumber) === index,
  )

  const withUsual = keepingUsual.reduce((assignment, claim) => assign(assignment, claim.playerId, claim.usualShirtNumber ?? 0), EMPTY_ASSIGNMENT)
  const firstExtraNumber = Math.max(0, ...withUsual.takenNumbers) + 1

  return needingNumber.reduce((assignment, claim) => assign(assignment, claim.playerId, firstFreeNumberFrom(assignment.takenNumbers, firstExtraNumber)), withUsual).numbersByPlayer
}
