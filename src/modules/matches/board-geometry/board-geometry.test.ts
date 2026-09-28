import { describe, expect, it } from 'vitest'
import { DOT_DRAG_BOUNDS, findNearestStarter, hasPassedDragThreshold, isInsideField, toFieldPoint } from './board-geometry'

const FIELD = { left: 100, top: 50, width: 1000, height: 600 }

describe('board-geometry', () => {
  it('toFieldPoint inside the field converts pixels to percentages', () => {
    expect(toFieldPoint({ clientX: 600, clientY: 350 }, FIELD, DOT_DRAG_BOUNDS)).toEqual({ x: 50, y: 50 })
  })

  it('toFieldPoint outside the field clamps to the drag bounds', () => {
    expect(toFieldPoint({ clientX: 0, clientY: 2000 }, FIELD, DOT_DRAG_BOUNDS)).toEqual({ x: 3, y: 92 })
  })

  it('hasPassedDragThreshold with a tiny movement is false and with a long one is true', () => {
    expect(hasPassedDragThreshold({ clientX: 0, clientY: 0 }, { clientX: 3, clientY: 3 })).toBe(false)
    expect(hasPassedDragThreshold({ clientX: 0, clientY: 0 }, { clientX: 10, clientY: 0 })).toBe(true)
  })

  it('findNearestStarter returns the closest starter within the swap radius or null', () => {
    const positions = { near: { x: 50, y: 50 }, far: { x: 10, y: 10 } }

    expect(findNearestStarter({ clientX: 620, clientY: 350 }, FIELD, positions)).toBe('near')
    expect(findNearestStarter({ clientX: 900, clientY: 600 }, FIELD, positions)).toBeNull()
  })

  it('isInsideField checks the field rectangle', () => {
    expect(isInsideField({ clientX: 150, clientY: 60 }, FIELD)).toBe(true)
    expect(isInsideField({ clientX: 50, clientY: 60 }, FIELD)).toBe(false)
  })
})
