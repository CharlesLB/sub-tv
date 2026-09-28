import { describe, expect, it } from 'vitest'
import { pluralize } from './pluralize'

describe('pluralize', () => {
  it('uses the singular form for exactly one item', () => {
    expect(pluralize(1, 'time', 'times')).toBe('1 time')
  })

  it('uses the plural form for several items', () => {
    expect(pluralize(3, 'time', 'times')).toBe('3 times')
  })

  it('uses the plural form for zero items', () => {
    expect(pluralize(0, 'selecionado', 'selecionados')).toBe('0 selecionados')
  })
})
