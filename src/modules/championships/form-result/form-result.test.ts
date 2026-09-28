import { describe, expect, it } from 'vitest'
import { FORM_RESULT, resultFor } from './form-result'

describe('resultFor', () => {
  it('returns a win when the team scored more than it conceded', () => {
    expect(resultFor(3, 1)).toBe(FORM_RESULT.WIN)
  })

  it('returns a loss when the team conceded more than it scored', () => {
    expect(resultFor(0, 2)).toBe(FORM_RESULT.LOSS)
  })

  it('returns a draw when both scores are equal', () => {
    expect(resultFor(1, 1)).toBe(FORM_RESULT.DRAW)
  })
})
