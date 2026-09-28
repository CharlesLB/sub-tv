import type { PitchPoint } from '../pitch-layout/pitch-layout'

export type PointerPosition = { clientX: number; clientY: number }
export type FieldRectangle = { left: number; top: number; width: number; height: number }
export type Bounds = { minimumX: number; maximumX: number; minimumY: number; maximumY: number }

export const DOT_DRAG_BOUNDS: Bounds = { minimumX: 3, maximumX: 97, minimumY: 8, maximumY: 92 }
export const RESERVE_DROP_BOUNDS: Bounds = { minimumX: 4, maximumX: 96, minimumY: 9, maximumY: 91 }
export const DRAG_THRESHOLD_PX = 6
export const SWAP_RADIUS_PX = 56

const clamp = (value: number, minimum: number, maximum: number): number => Math.min(maximum, Math.max(minimum, value))

export const hasPassedDragThreshold = (start: PointerPosition, current: PointerPosition): boolean => Math.hypot(current.clientX - start.clientX, current.clientY - start.clientY) > DRAG_THRESHOLD_PX

export const isInsideField = (pointer: PointerPosition, field: FieldRectangle): boolean =>
  pointer.clientX >= field.left && pointer.clientX <= field.left + field.width && pointer.clientY >= field.top && pointer.clientY <= field.top + field.height

export const toFieldPoint = (pointer: PointerPosition, field: FieldRectangle, bounds: Bounds): PitchPoint => ({
  x: clamp(((pointer.clientX - field.left) / field.width) * 100, bounds.minimumX, bounds.maximumX),
  y: clamp(((pointer.clientY - field.top) / field.height) * 100, bounds.minimumY, bounds.maximumY),
})

export const findNearestStarter = (pointer: PointerPosition, field: FieldRectangle, positions: Readonly<Record<string, PitchPoint>>): string | null => {
  const nearest = Object.entries(positions)
    .map(([playerId, point]) => ({
      playerId,
      distance: Math.hypot(pointer.clientX - (field.left + (point.x / 100) * field.width), pointer.clientY - (field.top + (point.y / 100) * field.height)),
    }))
    .reduce<{ playerId: string; distance: number } | null>((best, candidate) => (best === null || candidate.distance < best.distance ? candidate : best), null)

  return nearest && nearest.distance < SWAP_RADIUS_PX ? nearest.playerId : null
}
