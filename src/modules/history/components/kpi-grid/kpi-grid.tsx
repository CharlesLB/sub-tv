import { cn } from '@/lib/utils/cn'
import { KpiCard } from '../kpi-card/kpi-card'

const GRID_CLASS = {
  overview: 'grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))]',
  detail: 'grid-cols-[repeat(auto-fit,minmax(min(100%,160px),1fr))]',
} as const

type KpiGridProps = { kpis: { label: string; value: string }[]; variant: keyof typeof GRID_CLASS }

export function KpiGrid({ kpis, variant }: KpiGridProps) {
  return (
    <div className={cn('grid gap-[10px]', GRID_CLASS[variant])}>
      {kpis.map((kpi, index) => (
        <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} index={index} variant={variant} />
      ))}
    </div>
  )
}
