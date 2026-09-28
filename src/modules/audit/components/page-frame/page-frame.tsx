import type { ReactNode } from 'react'
import { pageFrameStyles as styles } from './page-frame.styles'

export function PageFrame({ children }: { children: ReactNode }) {
  return (
    <div className={styles.scrollArea}>
      <div className={styles.content}>{children}</div>
    </div>
  )
}
