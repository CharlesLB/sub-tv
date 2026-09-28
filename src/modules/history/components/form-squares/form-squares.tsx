import { cn } from '@/lib/utils/cn'
import { type FormResult, toFormSlots } from '@/modules/championships/client'
import { formSquaresStyles as styles } from './form-squares.styles'

export function FormSquares({ form }: { form: FormResult[] }) {
  return (
    <span className={styles.squares}>
      {toFormSlots(form).map((slot) => (
        <span key={slot.slotKey} className={cn(styles.square, styles.result[slot.result])}>
          {slot.result}
        </span>
      ))}
    </span>
  )
}
