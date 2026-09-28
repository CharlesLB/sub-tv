import type { FormResult } from '@/modules/championships/client'

const formResultStyles: Record<FormResult, string> = {
  V: 'bg-ac text-bg',
  E: 'bg-bd2 text-tx1',
  D: 'bg-vm text-bg',
}

export const formSquaresStyles = {
  squares: 'flex flex-none gap-[3px]',
  square: 'flex size-[17px] items-center justify-center text-[9px] font-medium',
  result: formResultStyles,
} as const
