import { LOGO_ACCENT, LogoMark } from '../logo-mark/logo-mark'
import { brandLogoStyles as styles } from './brand-logo.styles'

const MARK_SIZE = 32

export function BrandLogo() {
  return (
    <div title="sub.tv" className={styles.logo}>
      <LogoMark size={MARK_SIZE} />
      <span className={styles.wordmark}>
        sub<span style={{ color: LOGO_ACCENT }}>.</span>tv
      </span>
    </div>
  )
}
