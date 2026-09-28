import { cn } from '@/lib/utils/cn'
import { KpiCard } from '../kpi-card/kpi-card'
import { kpiGridStyles as styles } from './kpi-grid.styles'

type KpiGridProps = { kpis: { label: string; value: string }[]; variant: keyof typeof styles.gridVariant }

export function KpiGrid({ kpis, variant }: KpiGridProps) {
  return (
    <div className={cn(styles.grid, styles.gridVariant[variant])}>
      {kpis.map((kpi, index) => (
        <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} index={index} variant={variant} />
      ))}
    </div>
  )
}
