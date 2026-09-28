import { cn } from '@/lib/utils/cn'

type ScoreValueProps = { value: number; pulseCount: number }

export function ScoreValue({ value, pulseCount }: ScoreValueProps) {
  return (
    <span key={pulseCount} className={cn('skew-x-12 text-[27px] leading-none font-bold nums mobile:text-[23px]', pulseCount > 0 && 'animate-score-pulse')}>
      {value}
    </span>
  )
}
