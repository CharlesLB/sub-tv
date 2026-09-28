import { cn } from '@/lib/utils/cn'

const KPI_VARIANT = {
  overview: { wrapper: 'px-4 py-[14px]', value: 'text-[30.6px] tracking-[-.01em]', delayStepMs: 55 },
  detail: { wrapper: 'px-[15px] py-[13px]', value: 'text-[25.2px]', delayStepMs: 50 },
} as const

type KpiCardProps = { label: string; value: string; index: number; variant: keyof typeof KPI_VARIANT }

export function KpiCard({ label, value, index, variant }: KpiCardProps) {
  const styles = KPI_VARIANT[variant]

  return (
    <div className={cn('flex min-w-0 animate-fade-up flex-col gap-[5px] rounded-card border border-bd bg-pan', styles.wrapper)} style={{ animationDelay: `${index * styles.delayStepMs}ms` }}>
      <span className={cn('leading-none font-bold text-tx nums', styles.value)}>{value}</span>
      <span className="text-[10px] tracking-[.05em] text-tx4">{label}</span>
    </div>
  )
}
