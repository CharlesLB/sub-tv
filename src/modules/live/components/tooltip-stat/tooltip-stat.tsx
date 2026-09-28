import { cn } from '@/lib/utils/cn'

type TooltipStatProps = { label: string; value: number; highlightClass: string | null }

export function TooltipStat({ label, value, highlightClass }: TooltipStatProps) {
  return (
    <div className="flex items-baseline gap-1">
      <span className={cn('text-[15.3px] leading-none font-bold nums', value > 0 && highlightClass ? highlightClass : 'text-tx')}>{value}</span>
      <span className="text-[8.6px] font-semibold tracking-[-.01em] text-tx4">{label}</span>
    </div>
  )
}
