import { cn } from '@/lib/utils/cn'
import { toFormSlots } from '../../form-slots/form-slots'
import type { FormResult } from '../../types'
import { FormSquare } from '../form-square/form-square'
import { formSquaresStyles as styles } from './form-squares.styles'

type FormSquaresProps = { form: FormResult[]; className?: string }

export function FormSquares({ form, className }: FormSquaresProps) {
  return (
    <div className={cn(styles.row, className)}>
      {toFormSlots(form).map((slot) => (
        <FormSquare key={slot.slotKey} result={slot.result} />
      ))}
    </div>
  )
}
