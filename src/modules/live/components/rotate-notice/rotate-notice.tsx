import { Icon } from '@/components/ui/icon/icon'
import { rotateNoticeStyles as styles } from './rotate-notice.styles'

export function RotateNotice() {
  return (
    <div className={styles.notice}>
      <Icon name="screenRotation" size={22} className={styles.icon} />
      <span className={styles.texts}>
        <span className={styles.title}>Gire O celular para A prancheta</span>
        <span className={styles.description}>Na horizontal o campo abre inteiro e dá para arrastar os jogadores.</span>
      </span>
    </div>
  )
}
