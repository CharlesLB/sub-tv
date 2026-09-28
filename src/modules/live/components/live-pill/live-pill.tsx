import { livePillStyles as styles } from './live-pill.styles'

export function LivePill() {
  return (
    <span className={styles.pill}>
      <span className={styles.label}>Ao vivo</span>
    </span>
  )
}
