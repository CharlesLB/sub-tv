import { describe, expect, it } from 'vitest'
import { toFormSlots } from './form-slots'

describe('toFormSlots', () => {
  it('gives every recent result a distinct key in the order the games were played', () => {
    expect(toFormSlots(['V', 'V', 'D'])).toEqual([
      { slotKey: 'game-0', result: 'V' },
      { slotKey: 'game-1', result: 'V' },
      { slotKey: 'game-2', result: 'D' },
    ])
  })

  it('returns no slot when there is no recent result', () => {
    expect(toFormSlots([])).toEqual([])
  })
})
