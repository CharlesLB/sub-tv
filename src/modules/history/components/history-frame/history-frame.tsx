import type { ReactNode } from 'react'
import { historyFrameStyles as styles } from './history-frame.styles'

export function HistoryFrame({ children }: { children: ReactNode }) {
  return (
    <div className={styles.frame}>
      <div className={styles.content}>{children}</div>
    </div>
  )
}
