import { cn } from '@/lib/utils/cn'
import type { FormResult } from '@/modules/championships/client'
import { formSquaresStyles as styles } from './form-squares.styles'

export function FormSquares({ form }: { form: FormResult[] }) {
  return (
    <span className={styles.squares}>
      {form.map((result, index) => (
        <span key={`${result}-${index}`} className={cn(styles.square, styles.result[result])}>
          {result}
        </span>
      ))}
    </span>
  )
}
