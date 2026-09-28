import * as R from 'remeda'
import type { PitchPoint } from '@/modules/matches/client'

const MINIMUM_X = 4
const MAXIMUM_X = 96
const MINIMUM_Y = 9
const MAXIMUM_Y = 91
const PERCENT = 100
const DROP_RADIUS_PX = 56

export type FieldRect = { left: number; top: number; width: number; height: number }

export type PlacedTarget = { playerId: string; point: PitchPoint }

export const pointFromPointer = (rect: FieldRect, clientX: number, clientY: number): PitchPoint => ({
  x: R.clamp(((clientX - rect.left) / rect.width) * PERCENT, { min: MINIMUM_X, max: MAXIMUM_X }),
  y: R.clamp(((clientY - rect.top) / rect.height) * PERCENT, { min: MINIMUM_Y, max: MAXIMUM_Y }),
})

export const nearestDropTarget = (rect: FieldRect, targets: PlacedTarget[], clientX: number, clientY: number): string | null => {
  const measured = targets.map((target) => ({
    playerId: target.playerId,
    distance: Math.hypot(clientX - (rect.left + (target.point.x / PERCENT) * rect.width), clientY - (rect.top + (target.point.y / PERCENT) * rect.height)),
  }))

  const closest = R.firstBy(measured, (candidate) => candidate.distance)

  return closest && closest.distance < DROP_RADIUS_PX ? closest.playerId : null
}
