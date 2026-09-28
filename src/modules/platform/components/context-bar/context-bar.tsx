import { type ReactNode, Suspense } from 'react'
import { UserChip } from '@/modules/auth'
import { type Category, CategoryTag } from '@/modules/championships/client'
import { Breadcrumbs, type Crumb } from '../breadcrumbs/breadcrumbs'
import { LiveBroadcastChip } from '../live-broadcast-chip/live-broadcast-chip'
import { ThemeToggle } from '../theme-toggle/theme-toggle'
import { contextBarStyles as styles } from './context-bar.styles'

type ContextBarProps = {
  crumbs: Crumb[]
  title: string
  category?: Category | undefined
  detail?: string | undefined
  actions?: ReactNode
}

export function ContextBar({ crumbs, title, category, detail, actions }: ContextBarProps) {
  return (
    <header className={styles.bar}>
      <div className={styles.heading}>
        <Breadcrumbs crumbs={crumbs} />
        <h1 className={styles.title}>{title}</h1>
      </div>
      {category ? <CategoryTag category={category} size="large" className={styles.categoryTag} /> : null}
      {detail ? <span className={styles.detail}>{detail}</span> : null}
      <div className={styles.actions}>
        <Suspense fallback={null}>
          <LiveBroadcastChip />
        </Suspense>
        <Suspense fallback={null}>
          <UserChip />
        </Suspense>
        <ThemeToggle />
        {actions}
      </div>
    </header>
  )
}
