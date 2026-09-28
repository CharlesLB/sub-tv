import { cn } from '@/lib/utils/cn'
import type { FormResult } from '../../types'
import { formSquareStyles as styles } from './form-square.styles'

const FORM_TITLE: Record<FormResult, string> = {
  V: 'Vitória',
  E: 'Empate',
  D: 'Derrota',
}

type FormSquareProps = { result: FormResult; size?: 'small' | 'medium' }

export function FormSquare({ result, size = 'medium' }: FormSquareProps) {
  return (
    <span title={FORM_TITLE[result]} className={cn(styles.square, size === 'medium' ? styles.sizeMedium : styles.sizeSmall, styles.result[result])}>
      {result}
    </span>
  )
}
