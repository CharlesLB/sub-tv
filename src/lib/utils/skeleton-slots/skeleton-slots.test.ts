import { describe, expect, it } from 'vitest'
import { skeletonSlots } from './skeleton-slots'

describe('skeletonSlots', () => {
  it('names each placeholder by its position and keeps its order', () => {
    expect(skeletonSlots(3)).toEqual([
      { slotId: 'first', order: 0 },
      { slotId: 'second', order: 1 },
      { slotId: 'third', order: 2 },
    ])
  })

  it('returns no slot for zero placeholders', () => {
    expect(skeletonSlots(0)).toEqual([])
  })

  it('refuses more placeholders than it has names for', () => {
    expect(() => skeletonSlots(13)).toThrow('skeletonSlots supports at most 12 placeholders, received 13')
  })
})
