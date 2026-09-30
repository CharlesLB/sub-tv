'use client'

import { createPortal } from 'react-dom'
import { navigationProgressStyles as styles } from './navigation-progress.styles'

export const NAVIGATION_PROGRESS_LABEL = 'Carregando página'

export function NavigationProgress({ isActive }: { isActive: boolean }) {
  if (!isActive) return null

  return createPortal(
    <span role="progressbar" aria-label={NAVIGATION_PROGRESS_LABEL} className={styles.track}>
      <span className={styles.indicator} />
    </span>,
    document.body,
  )
}
