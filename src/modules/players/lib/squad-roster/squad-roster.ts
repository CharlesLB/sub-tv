import * as R from 'remeda'
import type { CuriosityVM, PlayerPosition, PreferredFoot, SquadPlayerVM } from '../../types'

export type SquadMembershipRow = {
  seasonTeamId: string
  playerId: string
  usualShirtNumber: number | null
  fullName: string
  nickname: string | null
  displayName: string | null
  position: PlayerPosition | null
  preferredFoot: PreferredFoot | null
}

export type PlayerStatRow = { playerId: string; games: number; goals: number; yellowCards: number; redCards: number }

export type CuriosityRow = CuriosityVM & { playerId: string | null }

type SquadRosterInput = {
  seasonTeamIds: string[]
  memberships: SquadMembershipRow[]
  stats: PlayerStatRow[]
  curiosities: CuriosityRow[]
  otherCategoryPlayerIds: string[]
}

const SORT_LOCALE = 'pt-BR'
const MISSING_NUMBER_RANK = Number.MAX_SAFE_INTEGER

const stripAccents = (text: string): string => text.normalize('NFD').replace(/[̀-ͯ]/g, '')

const normalizeForSearch = (text: string): string => stripAccents(text).trim().toLowerCase()

const byTeamPriority = (seasonTeamIds: string[]) => (membership: SquadMembershipRow) => seasonTeamIds.indexOf(membership.seasonTeamId)

const toSquadPlayer = (memberships: SquadMembershipRow[], input: SquadRosterInput, statsByPlayer: Record<string, PlayerStatRow[]>): SquadPlayerVM | null => {
  const [primary] = memberships
  if (!primary) return null
  const playerStats = statsByPlayer[primary.playerId] ?? []

  return {
    id: primary.playerId,
    shirtNumber: memberships.find((membership) => membership.usualShirtNumber !== null)?.usualShirtNumber ?? null,
    fullName: primary.fullName,
    nickname: primary.nickname,
    displayName: primary.displayName,
    position: primary.position,
    preferredFoot: primary.preferredFoot,
    games: R.sumBy(playerStats, (stat) => stat.games),
    goals: R.sumBy(playerStats, (stat) => stat.goals),
    yellowCards: R.sumBy(playerStats, (stat) => stat.yellowCards),
    redCards: R.sumBy(playerStats, (stat) => stat.redCards),
    curiosities: input.curiosities.filter((curiosity) => curiosity.playerId === primary.playerId).map(({ id, text }) => ({ id, text })),
    isInOtherCategory: input.otherCategoryPlayerIds.includes(primary.playerId),
  }
}

export const buildSquadPlayers = (input: SquadRosterInput): SquadPlayerVM[] => {
  const statsByPlayer = R.groupBy(input.stats, (stat) => stat.playerId)

  return R.pipe(
    input.memberships,
    R.sortBy(byTeamPriority(input.seasonTeamIds)),
    R.groupBy((membership) => membership.playerId),
    R.values(),
    R.map((memberships) => toSquadPlayer(memberships, input, statsByPlayer)),
    R.filter(R.isNonNullish),
    R.sort((left, right) => (left.shirtNumber ?? MISSING_NUMBER_RANK) - (right.shirtNumber ?? MISSING_NUMBER_RANK) || left.fullName.localeCompare(right.fullName, SORT_LOCALE)),
  )
}

export const matchesSquadSearch = (player: SquadPlayerVM, rawQuery: string): boolean => {
  const query = normalizeForSearch(rawQuery)
  if (!query) return true
  if (player.shirtNumber !== null && String(player.shirtNumber) === query) return true

  return [player.fullName, player.nickname, player.displayName].some((name) => name !== null && normalizeForSearch(name).includes(query))
}

export const toRosterName = (player: SquadPlayerVM): string => (player.displayName ? `${player.fullName} "${player.displayName}"` : player.fullName)
