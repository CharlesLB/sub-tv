import { SHARE_CARD_ACCENT, shareCardStyles as styles } from './share-card.styles'

const MARK_SIZE = 150

type ShareCardProps = { tagline: string; categories: string }

export function ShareCard({ tagline, categories }: ShareCardProps) {
  return (
    <div style={styles.card}>
      <div style={styles.brand}>
        <svg viewBox="0 0 48 48" width={MARK_SIZE} height={MARK_SIZE} aria-hidden>
          <g fill="none" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round">
            <rect x="4" y="8" width="40" height="28" rx="6" />
            <line x1="24" y1="8" x2="24" y2="36" />
            <circle cx="24" cy="22" r="6" />
            <line x1="16" y1="42" x2="32" y2="42" />
          </g>
          <circle cx="36" cy="15" r="3.6" fill={SHARE_CARD_ACCENT} />
        </svg>
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
