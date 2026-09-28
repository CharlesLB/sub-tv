import { cn } from '@/lib/utils/cn'
import type { FormResult } from '@/modules/championships/client'

const FORM_CLASS: Record<FormResult, string> = {
  V: 'bg-ac text-bg',
  E: 'bg-bd2 text-tx1',
  D: 'bg-vm text-bg',
}

export function FormSquares({ form }: { form: FormResult[] }) {
  return (
    <span className="flex flex-none gap-[3px]">
      {form.map((result, index) => (
        <span key={`${result}-${index}`} className={cn('flex size-[17px] items-center justify-center text-[9px] font-medium', FORM_CLASS[result])}>
          {result}
        </span>
      ))}
    </span>
  )
}
