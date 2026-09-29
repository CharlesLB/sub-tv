import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { historySectionSkeletonStyles as skeletonStyles } from './history-section.skeleton.styles'
import { historySectionStyles as styles } from './history-section.styles'

type HistorySectionSkeletonProps = { titleWidthClass: string; className?: string; children: ReactNode }

export function HistorySectionSkeleton({ titleWidthClass, className, children }: HistorySectionSkeletonProps) {
  return (
    <div aria-hidden className={cn(styles.section, className)}>
      <Skeleton className={cn(styles.title, skeletonStyles.title, titleWidthClass)} />
      {children}
    </div>
  )
}
