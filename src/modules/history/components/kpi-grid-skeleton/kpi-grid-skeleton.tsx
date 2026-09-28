import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'

const KPI_SKELETON_VARIANT = {
  overview: { grid: 'grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))]', card: 'px-4 py-[14px]', value: 'h-[31px]' },
  detail: { grid: 'grid-cols-[repeat(auto-fit,minmax(min(100%,160px),1fr))]', card: 'px-[15px] py-[13px]', value: 'h-[25px]' },
  highlight: { grid: 'grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))]', card: 'px-4 py-[14px]', value: 'h-7' },
} as const

const CARD_DELAY_STEP_MS = 60

type KpiGridSkeletonProps = { count: number; variant: keyof typeof KPI_SKELETON_VARIANT; className?: string }

export function KpiGridSkeleton({ count, variant, className }: KpiGridSkeletonProps) {
  const styles = KPI_SKELETON_VARIANT[variant]

  return (
    <div aria-hidden className={cn('grid gap-[10px]', styles.grid, className)}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={cn('flex flex-col gap-[7px] rounded-card border border-bd bg-pan', styles.card)}>
          <Skeleton className={cn('w-[46%]', styles.value)} delayMs={index * CARD_DELAY_STEP_MS} />
          <Skeleton className="h-[10px] w-[62%]" delayMs={index * CARD_DELAY_STEP_MS + 40} />
        </div>
      ))}
    </div>
  )
}
