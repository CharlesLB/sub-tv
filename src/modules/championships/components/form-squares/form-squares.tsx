import { cn } from '@/lib/utils/cn'
import { toFormSlots } from '../../lib/form-slots/form-slots'
import type { FormResult } from '../../types'
import { FormSquare } from '../form-square/form-square'
import { FORM_SQUARE_SIZE, type FormSquareSize } from '../form-square/form-square.styles'
import { formSquaresStyles as styles } from './form-squares.styles'

type FormSquaresProps = { form: FormResult[]; size?: FormSquareSize; className?: string }

export function FormSquares({ form, size = FORM_SQUARE_SIZE.MEDIUM, className }: FormSquaresProps) {
  return (
    <div className={cn(styles.row, className)}>
      {toFormSlots(form).map((slot) => (
        <FormSquare key={slot.slotKey} result={slot.result} size={size} />
      ))}
    </div>
  )
}
