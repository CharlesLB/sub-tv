import type { KeyboardEvent, PointerEvent } from 'react'
import { cn } from '@/lib/utils/cn'
import type { PitchPoint } from '../../pitch-layout/pitch-layout'

type PitchDotProps = {
  shirtNumber: number
  label: string
  description: string
  color: string
  point: PitchPoint
  isDragging: boolean
  isSwapTarget: boolean
  onPointerDown: (event: PointerEvent<HTMLButtonElement>) => void
  onKeyboardBench: () => void
}

const BENCH_KEYS = new Set(['Enter', ' ', 'Delete', 'Backspace'])

export function PitchDot({ shirtNumber, label, description, color, point, isDragging, isSwapTarget, onPointerDown, onKeyboardBench }: PitchDotProps) {
  const benchFromKeyboard = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!BENCH_KEYS.has(event.key)) return
    event.preventDefault()
    onKeyboardBench()
  }

  return (
    <div
      className={cn('absolute flex w-[13%] -translate-1/2 flex-col items-center gap-[2px]', isDragging ? 'z-[6]' : isSwapTarget ? 'z-[4]' : 'z-[2]')}
      style={{ left: `${point.x}%`, top: `${point.y}%` }}
    >
      <button
        type="button"
        title={`${description} — arraste para reposicionar, clique para mandar ao banco`}
        aria-label={`${description}. Enter manda ao banco`}
        onPointerDown={onPointerDown}
        onKeyDown={benchFromKeyboard}
        className={cn(
          'relative flex aspect-square w-[46%] touch-none items-center justify-center rounded-full border-[3px] p-0 transition-[border-color,scale] duration-[140ms] hover:border-tx',
          isDragging ? 'cursor-grabbing opacity-85' : 'cursor-grab',
          isSwapTarget ? 'scale-110 border-gr-tx' : 'border-[var(--gr0)]',
        )}
        style={{ background: color }}
      >
        <span className="text-[clamp(9px,2.1cqw,15px)] leading-none font-bold text-bg nums">{shirtNumber}</span>
      </button>
      <div className="bg-gr-chip px-[5px] pt-px pb-[2px] text-[clamp(7px,2.1cqw,14px)] font-bold tracking-[-.01em] whitespace-nowrap text-gr-tx [text-shadow:0_1px_2px_rgba(0,0,0,.35)] [@container(max-height:190px)]:hidden">
        {label}
      </div>
    </div>
  )
}
