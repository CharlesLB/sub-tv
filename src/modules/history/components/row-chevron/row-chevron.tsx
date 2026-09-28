import { Icon } from '@/components/ui/icon/icon'
import { rowChevronStyles as styles } from './row-chevron.styles'

export function RowChevron() {
  return (
    <span className={styles.chevron}>
      <Icon name="chevronRight" size={17} />
    </span>
  )
}
