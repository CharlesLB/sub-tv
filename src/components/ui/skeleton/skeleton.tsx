import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils/cn'

type SkeletonProps = {
  className?: string
  delayMs?: number
  style?: CSSProperties
}

export function Skeleton({ className, delayMs = 0, style }: SkeletonProps) {
  return <span aria-hidden className={cn('block animate-skeleton bg-bd', className)} style={{ animationDelay: `${delayMs}ms`, ...style }} />
}
