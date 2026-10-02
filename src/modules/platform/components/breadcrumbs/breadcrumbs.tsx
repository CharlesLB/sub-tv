import Link from 'next/link'
import type { AppHref } from '@/lib/routes'
import { LinkPendingIndicator } from '@/components/ui/link-pending-indicator/link-pending-indicator'
import { breadcrumbsStyles as styles } from './breadcrumbs.styles'

export type Crumb = { label: string; href?: AppHref; separator?: '/' | '·' }

const CRUMB_DELAY_STEP_MS = 50

type BreadcrumbsProps = { crumbs: Crumb[] }

export function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  return (
    <nav aria-label="Trilha de navegação" className={styles.trail}>
      {crumbs.map((crumb, index) => (
        <span key={`${crumb.label} ${crumb.href ?? ''}`} className={styles.crumb} style={{ animationDelay: `${index * CRUMB_DELAY_STEP_MS}ms` }}>
          {index > 0 ? <span className={styles.separator}>{crumb.separator ?? '/'}</span> : null}
          {crumb.href ? (
            <Link href={crumb.href} className={styles.link}>
              {crumb.label}
              <LinkPendingIndicator />
            </Link>
          ) : (
            <span aria-current="page" className={styles.currentPage}>
              {crumb.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
