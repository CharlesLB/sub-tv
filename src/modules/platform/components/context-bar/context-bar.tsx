import type { ReactNode } from 'react'
import { type Category, CategoryTag } from '@/modules/championships/client'
import { Breadcrumbs, type Crumb } from '../breadcrumbs/breadcrumbs'
import { ContextBarStatus } from '../context-bar-status/context-bar-status'
import { ThemeToggle } from '../theme-toggle/theme-toggle'
import { contextBarStyles as styles } from './context-bar.styles'

type ContextBarProps = {
  crumbs: Crumb[]
  title: string
  category?: Category | undefined
  categoryTag?: ReactNode
  detail?: string | undefined
  actions?: ReactNode
}

export function ContextBar({ crumbs, title, category, categoryTag, detail, actions }: ContextBarProps) {
  return (
    <header className={styles.bar}>
      <div className={styles.heading}>
        <Breadcrumbs crumbs={crumbs} />
        <h1 className={styles.title}>{title}</h1>
      </div>
      {category ? <CategoryTag category={category} size="large" className={styles.categoryTag} /> : null}
      {categoryTag ? <span className={styles.categoryTag}>{categoryTag}</span> : null}
      {detail ? <span className={styles.detail}>{detail}</span> : null}
      <div className={styles.actions}>
        <ContextBarStatus />
        <ThemeToggle />
        {actions}
      </div>
    </header>
  )
}
