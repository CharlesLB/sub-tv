import { cn } from '@/lib/utils/cn'

const CREST_HEIGHT_RATIO = 1.2

type CrestProps = {
  color: string
  width?: number
  className?: string
}

export function Crest({ color, width = 18, className }: CrestProps) {
  return (
    <span
      aria-hidden
      className={cn('hexagon inline-block flex-none', className)}
      style={{ width, height: Math.round(width * CREST_HEIGHT_RATIO), background: color }}
    />
  )
}
