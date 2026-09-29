import type { FormResult } from '../../types'

export const FORM_SQUARE_SIZE = {
  SMALL: 'small',
  DENSE: 'dense',
  MEDIUM: 'medium',
} as const

export type FormSquareSize = (typeof FORM_SQUARE_SIZE)[keyof typeof FORM_SQUARE_SIZE]

const RESULT_TONE: Record<FormResult, string> = {
  V: 'bg-ac text-bg',
  E: 'bg-bd2 text-tx',
  D: 'bg-vm text-bg',
}

export const formSquareStyles = {
  square: 'inline-flex flex-none items-center justify-center font-semibold',
  size: {
    [FORM_SQUARE_SIZE.SMALL]: 'size-4 text-[9.5px]',
    [FORM_SQUARE_SIZE.DENSE]: 'size-[17px] text-[9px] font-medium',
    [FORM_SQUARE_SIZE.MEDIUM]: 'size-[18px] text-[10px]',
  } satisfies Record<FormSquareSize, string>,
  result: {
    [FORM_SQUARE_SIZE.SMALL]: RESULT_TONE,
    [FORM_SQUARE_SIZE.DENSE]: { ...RESULT_TONE, E: 'bg-bd2 text-tx1' },
    [FORM_SQUARE_SIZE.MEDIUM]: RESULT_TONE,
  } satisfies Record<FormSquareSize, Record<FormResult, string>>,
} as const
