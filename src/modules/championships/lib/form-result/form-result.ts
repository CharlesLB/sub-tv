import type { FormResult } from '../../types'

export const FORM_RESULT = { WIN: 'V', DRAW: 'E', LOSS: 'D' } as const satisfies Record<string, FormResult>

export const FORM_LENGTH = 5

export const resultFor = (goalsScored: number, goalsConceded: number): FormResult => {
  if (goalsScored > goalsConceded) return FORM_RESULT.WIN
  if (goalsScored < goalsConceded) return FORM_RESULT.LOSS

  return FORM_RESULT.DRAW
}
