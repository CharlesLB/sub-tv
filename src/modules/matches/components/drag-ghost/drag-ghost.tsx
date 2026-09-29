'use client'

import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils/cn'
import { dragGhostStyles as styles } from './drag-ghost.styles'

type DragGhostProps = { shirtNumber: number; name: string; color: string; left: number; top: number; isOverTarget: boolean }

export function DragGhost({ shirtNumber, name, color, left, top, isOverTarget }: DragGhostProps) {
  return createPortal(
    <div aria-hidden className={cn(styles.ghost, isOverTarget ? styles.ghostOverTarget : styles.ghostWithoutTarget)} style={{ left, top }}>
      <span className={styles.shirtNumber} style={{ color }}>
        {shirtNumber}
      </span>
      <span className={styles.name}>{name}</span>
    </div>,
    document.body,
  )
}
