import { describe, expect, it } from 'vitest'
import { PitchPointSchema } from './pitch-coordinate'

describe('PitchPointSchema', () => {
  it('accepts points on the edges of the pitch', () => {
    expect(PitchPointSchema.safeParse({ x: 0, y: 100 }).success).toBe(true)
  })

  it('rejects points outside the zero to one hundred range', () => {
    expect(PitchPointSchema.safeParse({ x: -1, y: 50 }).success).toBe(false)
    expect(PitchPointSchema.safeParse({ x: 50, y: 100.5 }).success).toBe(false)
  })
})
