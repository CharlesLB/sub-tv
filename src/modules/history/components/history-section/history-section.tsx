import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

type HistorySectionProps = { title: string; className?: string; children: ReactNode }

export function HistorySection({ title, className, children }: HistorySectionProps) {
  return (
    <section aria-label={title} className={cn('flex min-w-0 flex-col gap-[10px]', className)}>
      <h2 className="text-[15.3px] font-bold tracking-[-.01em] text-tx1">{title}</h2>
      {children}
    </section>
  )
}
