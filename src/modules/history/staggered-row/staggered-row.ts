import type { CSSProperties } from 'react'
import { staggeredRowStyles as styles } from './staggered-row.styles'

const MAX_ROW_DELAY_MS = 400

export type StaggeredRow = { className: string; style: CSSProperties }

export const staggeredRowOf = (position: number, delayStepMs: number): StaggeredRow => ({
  className: position % 2 === 1 ? styles.oddRow : styles.evenRow,
  style: { animationDelay: `${Math.min(MAX_ROW_DELAY_MS, position * delayStepMs)}ms` },
})
