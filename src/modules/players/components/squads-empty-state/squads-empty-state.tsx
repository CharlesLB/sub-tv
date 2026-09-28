import { Icon } from '@/components/ui/icon/icon'
import { squadsEmptyStateStyles as styles } from './squads-empty-state.styles'

type SquadsEmptyStateProps = { title: string; description: string }

export function SquadsEmptyState({ title, description }: SquadsEmptyStateProps) {
  return (
    <section className={styles.section}>
      <Icon name="groups" size={28} className={styles.icon} />
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
    </section>
  )
}
