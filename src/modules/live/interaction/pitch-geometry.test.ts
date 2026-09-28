import { describe, expect, it } from 'vitest'
import { nearestDropTarget, pointFromPointer } from './pitch-geometry'

const FIELD = { left: 100, top: 50, width: 1050, height: 640 }

describe('pitch geometry', () => {
  it('pointer inside the field becomes a percentage point', () => {
    expect(pointFromPointer(FIELD, 625, 370)).toEqual({ x: 50, y: 50 })
  })

  it('pointer outside the field is clamped to the playable margin', () => {
    expect(pointFromPointer(FIELD, 0, 2000)).toEqual({ x: 4, y: 91 })
  })

  it('drop near a starter returns that starter', () => {
    const targets = [
      { playerId: 'near', point: { x: 50, y: 50 } },
      { playerId: 'far', point: { x: 10, y: 10 } },
    ]

    expect(nearestDropTarget(FIELD, targets, 640, 380)).toBe('near')
  })

  it('drop far from every starter returns no target', () => {
    expect(nearestDropTarget(FIELD, [{ playerId: 'only', point: { x: 90, y: 90 } }], 120, 60)).toBeNull()
  })
})
