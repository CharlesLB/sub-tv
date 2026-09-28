import { Icon } from '@/components/ui/icon/icon'
import type { IconName } from '@/components/ui/icon/icon-paths'
import { wizardNoticeStyles as styles } from './wizard-notice.styles'

type WizardNoticeProps = { icon: IconName; text: string }

export function WizardNotice({ icon, text }: WizardNoticeProps) {
  return (
    <div className={styles.notice}>
      <Icon name={icon} size={19} className={styles.icon} />
      <p className={styles.text}>{text}</p>
    </div>
  )
}
