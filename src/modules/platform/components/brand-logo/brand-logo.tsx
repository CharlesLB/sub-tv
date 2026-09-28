import { brandLogoStyles as styles } from './brand-logo.styles'

const LOGO_ACCENT = '#E0512F'

export function BrandLogo() {
  return (
    <div title="sub.tv" className={styles.logo}>
      <svg viewBox="0 0 48 48" width="32" height="32" aria-hidden>
        <g fill="none" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round">
          <rect x="4" y="8" width="40" height="28" rx="6" />
          <line x1="24" y1="8" x2="24" y2="36" />
          <circle cx="24" cy="22" r="6" />
          <line x1="16" y1="42" x2="32" y2="42" />
        </g>
        <circle cx="36" cy="15" r="3.6" fill={LOGO_ACCENT} />
      </svg>
      <span className={styles.wordmark}>
        sub<span style={{ color: LOGO_ACCENT }}>.</span>tv
      </span>
    </div>
  )
}
