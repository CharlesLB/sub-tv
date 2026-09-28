import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import { historySectionStyles as styles } from './history-section.styles'

type HistorySectionProps = { title: string; className?: string; children: ReactNode }

export function HistorySection({ title, className, children }: HistorySectionProps) {
  return (
    <section aria-label={title} className={cn(styles.section, className)}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </section>
  )
}
