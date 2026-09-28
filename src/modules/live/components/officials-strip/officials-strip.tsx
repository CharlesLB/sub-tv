import { Icon } from '@/components/ui/icon/icon'
import type { OfficialsStripItem } from './officials-strip-items'
import { officialsStripStyles as styles } from './officials-strip.styles'

type OfficialsStripProps = { items: OfficialsStripItem[] }

export function OfficialsStrip({ items }: OfficialsStripProps) {
  return (
    <div data-screen-label="Ficha e arbitragem" className={styles.strip}>
      {items.map((item) => (
        <div key={item.key} className={styles.item}>
          <Icon name={item.icon} size={11} className={styles.icon} />
          <span className={styles.label}>{item.label}</span>
          <span className={styles.value}>{item.value}</span>
        </div>
      ))}
    </div>
  )
}
