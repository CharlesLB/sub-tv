import type { Route } from 'next'
import Link from 'next/link'
import { emptyStateStyles as styles } from './empty-state.styles'

type EmptyStateProps = {
  title: string
  description: string
  action?: { label: string; href: Route }
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <span aria-hidden className={styles.hexagon} />
        <span className={styles.title}>{title}</span>
        <span className={styles.description}>{description}</span>
        {action ? (
          <Link href={action.href} className={styles.action}>
            {action.label}
          </Link>
        ) : null}
      </div>
    </div>
  )
}
