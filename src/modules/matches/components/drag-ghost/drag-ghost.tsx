'use client'

import { createPortal } from 'react-dom'
import { dragGhostStyles as styles } from './drag-ghost.styles'

type DragGhostProps = { shirtNumber: number; name: string; color: string; left: number; top: number }

export function DragGhost({ shirtNumber, name, color, left, top }: DragGhostProps) {
  return createPortal(
    <div aria-hidden className={styles.ghost} style={{ left, top }}>
      <span className={styles.shirtNumber} style={{ color }}>
        {shirtNumber}
      </span>
      <span className={styles.name}>{name}</span>
    </div>,
    document.body,
  )
}
