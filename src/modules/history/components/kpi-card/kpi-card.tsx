import { cn } from '@/lib/utils/cn'
import { kpiCardStyles as styles } from './kpi-card.styles'

const DELAY_STEP_MS = { overview: 55, detail: 50 } as const

type KpiCardProps = { label: string; value: string; index: number; variant: keyof typeof DELAY_STEP_MS }

export function KpiCard({ label, value, index, variant }: KpiCardProps) {
  return (
    <div className={cn(styles.card, styles.cardVariant[variant])} style={{ animationDelay: `${index * DELAY_STEP_MS[variant]}ms` }}>
      <span className={cn(styles.value, styles.valueVariant[variant])}>{value}</span>
      <span className={styles.label}>{label}</span>
    </div>
  )
}
