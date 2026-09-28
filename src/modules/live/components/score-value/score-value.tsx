import { cn } from '@/lib/utils/cn'
import { scoreValueStyles as styles } from './score-value.styles'

type ScoreValueProps = { value: number; pulseCount: number }

export function ScoreValue({ value, pulseCount }: ScoreValueProps) {
  return (
    <span key={pulseCount} className={cn(styles.value, pulseCount > 0 && styles.pulsing)}>
      {value}
    </span>
  )
}
