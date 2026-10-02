import type { Route } from 'next'
import Link from 'next/link'
import { LinkPendingIndicator } from '@/components/ui/link-pending-indicator/link-pending-indicator'
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
            <LinkPendingIndicator />
          </Link>
        ) : null}
      </div>
    </div>
  )
}
