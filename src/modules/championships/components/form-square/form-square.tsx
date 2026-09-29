import { cn } from '@/lib/utils/cn'
import type { FormResult } from '../../types'
import { FORM_SQUARE_SIZE, type FormSquareSize, formSquareStyles as styles } from './form-square.styles'

const FORM_TITLE: Record<FormResult, string> = {
  V: 'Vitória',
  E: 'Empate',
  D: 'Derrota',
}

type FormSquareProps = { result: FormResult; size?: FormSquareSize }

export function FormSquare({ result, size = FORM_SQUARE_SIZE.MEDIUM }: FormSquareProps) {
  return (
    <span title={FORM_TITLE[result]} className={cn(styles.square, styles.size[size], styles.result[size][result])}>
      {result}
    </span>
  )
}
