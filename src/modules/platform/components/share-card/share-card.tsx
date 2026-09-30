import { LogoMark } from '../logo-mark/logo-mark'
import { shareCardStyles as styles } from './share-card.styles'

const MARK_SIZE = 150

type ShareCardProps = { tagline: string; categories: string }

export function ShareCard({ tagline, categories }: ShareCardProps) {
  return (
    <div style={styles.card}>
      <div style={styles.brand}>
        <LogoMark size={MARK_SIZE} />
        <div style={styles.wordmark}>
          sub<span style={styles.wordmarkDot}>.</span>tv
        </div>
      </div>
      <div style={styles.footer}>
        <div style={styles.tagline}>{tagline}</div>
        <div style={styles.categories}>{categories}</div>
      </div>
    </div>
  )
}
