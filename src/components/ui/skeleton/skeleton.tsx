import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils/cn'
import { skeletonStyles as styles } from './skeleton.styles'

type SkeletonProps = {
  className?: string
  delayMs?: number
  style?: CSSProperties
}

export function Skeleton({ className, delayMs = 0, style }: SkeletonProps) {
  return <span aria-hidden className={cn(styles.skeleton, className)} style={{ animationDelay: `${delayMs}ms`, ...style }} />
}
