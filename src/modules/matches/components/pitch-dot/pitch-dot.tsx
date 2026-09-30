import type { KeyboardEvent, PointerEvent } from 'react'
import { cn } from '@/lib/utils/cn'
import type { PitchPoint } from '../../lib/pitch-layout/pitch-layout'
import { pitchDotStyles as styles } from './pitch-dot.styles'

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
    <div className={cn(styles.anchor, isDragging ? styles.anchorDragging : isSwapTarget ? styles.anchorSwapTarget : styles.anchorIdle)} style={{ left: `${point.x}%`, top: `${point.y}%` }}>
      <button
        type="button"
        title={`${description} — arraste para reposicionar, clique para mandar ao banco`}
        aria-label={`${description}. Enter manda ao banco`}
        onPointerDown={onPointerDown}
        onKeyDown={benchFromKeyboard}
        className={cn(styles.dot, isDragging ? styles.dotDragging : styles.dotIdle, isSwapTarget ? styles.dotSwapTarget : styles.dotDefaultBorder)}
        style={{ background: color }}
      >
        <span className={styles.shirtNumber}>{shirtNumber}</span>
      </button>
      <div className={styles.label}>{label}</div>
    </div>
  )
}
