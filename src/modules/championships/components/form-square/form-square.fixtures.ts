import type { FormResult } from '../../types'

export const FORM_RESULT = { WIN: 'V', DRAW: 'E', LOSS: 'D' } as const satisfies Record<string, FormResult>

export const recentFormFixture: FormResult[] = [FORM_RESULT.WIN, FORM_RESULT.WIN, FORM_RESULT.DRAW, FORM_RESULT.LOSS, FORM_RESULT.WIN]
