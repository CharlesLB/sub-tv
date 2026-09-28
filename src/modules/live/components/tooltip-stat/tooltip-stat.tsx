import { cn } from '@/lib/utils/cn'
import { tooltipStatStyles as styles } from './tooltip-stat.styles'

type TooltipStatProps = { label: string; value: number; highlightClass: string | null }

export function TooltipStat({ label, value, highlightClass }: TooltipStatProps) {
  return (
    <div className={styles.stat}>
      <span className={cn(styles.value, value > 0 && highlightClass ? highlightClass : styles.valuePlain)}>{value}</span>
      <span className={styles.label}>{label}</span>
    </div>
  )
}
