import { cn } from '@/lib/utils/cn'
import type { FormResult } from '../../types'

const FORM_STYLE: Record<FormResult, { className: string; title: string }> = {
  V: { className: 'bg-ac text-bg', title: 'Vitória' },
  E: { className: 'bg-bd2 text-tx', title: 'Empate' },
  D: { className: 'bg-vm text-bg', title: 'Derrota' },
}

type FormSquareProps = { result: FormResult; size?: 'small' | 'medium' }

export function FormSquare({ result, size = 'medium' }: FormSquareProps) {
  return (
    <span
      title={FORM_STYLE[result].title}
      className={cn(
        'inline-flex flex-none items-center justify-center font-semibold',
        size === 'medium' ? 'size-[18px] text-[10px]' : 'size-4 text-[9.5px]',
        FORM_STYLE[result].className,
      )}
    >
      {result}
    </span>
  )
}

type FormSquaresProps = { form: FormResult[]; className?: string }

export function FormSquares({ form, className }: FormSquaresProps) {
  return (
    <div className={cn('flex items-center justify-end gap-[3px]', className)}>
      {form.map((result, index) => (
        <FormSquare key={index} result={result} />
      ))}
    </div>
  )
}
