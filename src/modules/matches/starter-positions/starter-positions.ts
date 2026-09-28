import * as R from 'remeda'
import { layoutStarters, type PitchPlayer, type PitchPoint } from '../pitch-layout/pitch-layout'
import type { SetupTeamVM } from '../types'

export type StarterPositions = Readonly<Record<string, PitchPoint>>

const OCCUPIED_DISTANCE_X = 4
const OCCUPIED_DISTANCE_Y = 6
const FALLBACK_X = 44
const CENTER_Y = 50

const startersAsPitchPlayers = (team: SetupTeamVM, starterIds: readonly string[]): PitchPlayer[] => {
  const starterSet = new Set(starterIds)

  return team.players.filter((player) => starterSet.has(player.playerId)).map((player) => ({ key: player.playerId, shirtNumber: player.shirtNumber, position: player.position }))
}

const isOccupied = (positions: StarterPositions, point: PitchPoint): boolean =>
  Object.values(positions).some((taken) => Math.abs(taken.x - point.x) < OCCUPIED_DISTANCE_X && Math.abs(taken.y - point.y) < OCCUPIED_DISTANCE_Y)

const fallbackPoint = (attacksRight: boolean): PitchPoint => ({ x: attacksRight ? FALLBACK_X : 100 - FALLBACK_X, y: CENTER_Y })

export const seedStarterPositions = (team: SetupTeamVM, starterIds: readonly string[], attacksRight: boolean): StarterPositions =>
  layoutStarters(startersAsPitchPlayers(team, starterIds), attacksRight)

export const resolveStarterPositions = (team: SetupTeamVM, starterIds: readonly string[], saved: StarterPositions, attacksRight: boolean): StarterPositions => {
  const starters = startersAsPitchPlayers(team, starterIds)
  const layout = layoutStarters(starters, attacksRight)

  const kept: StarterPositions = Object.fromEntries(
    starters.flatMap((starter) => {
      const point = saved[starter.key]

      return point ? [[starter.key, point]] : []
    }),
  )

  const slots = R.values(layout)

  return starters
    .filter((starter) => !kept[starter.key])
    .reduce<StarterPositions>((positions, starter) => {
      const preferred = layout[starter.key]
      const freeSlot = preferred && !isOccupied(positions, preferred) ? preferred : slots.find((slot) => !isOccupied(positions, slot))

      // biome-ignore lint/performance/noAccumulatingSpread: cada passo lê o acumulado anterior e a coleção tem poucas dezenas de itens
      return { ...positions, [starter.key]: freeSlot ?? fallbackPoint(attacksRight) }
    }, kept)
}
