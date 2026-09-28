import { cn } from '@/lib/utils/cn'
import type { FormResult } from '../../types'
import { FormSquare } from '../form-square/form-square'
import { formSquaresStyles as styles } from './form-squares.styles'

type FormSquaresProps = { form: FormResult[]; className?: string }

export function FormSquares({ form, className }: FormSquaresProps) {
  return (
    <div className={cn(styles.row, className)}>
      {form.map((result, index) => (
        <FormSquare key={index} result={result} />
      ))}
    </div>
  )
}
