import Link from 'next/link'
import { Fragment } from 'react'
import type { AppHref } from '@/lib/routes'

export type Crumb = { label: string; href?: AppHref; separator?: '/' | '·' }

const CRUMB_DELAY_STEP_MS = 50

type BreadcrumbsProps = { crumbs: Crumb[] }

export function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  return (
    <nav aria-label="Trilha de navegação" className="flex min-w-0 items-center gap-[5px]">
      {crumbs.map((crumb, index) => (
        <Fragment key={`${crumb.label}-${index}`}>
          <span className="inline-flex min-w-0 animate-crumb-in items-center gap-[5px]" style={{ animationDelay: `${index * CRUMB_DELAY_STEP_MS}ms` }}>
            {index > 0 ? <span className="text-[10.5px] text-tx5">{crumb.separator ?? '/'}</span> : null}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="max-w-[30vw] truncate text-[10.5px] tracking-[.1em] whitespace-nowrap text-crumb-tinta underline decoration-crumb-tinta underline-offset-[3px] transition-colors hover:text-ac hover:decoration-ac"
              >
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="max-w-[30vw] truncate text-[10.5px] tracking-[.1em] whitespace-nowrap text-crumb-apagado">
                {crumb.label}
              </span>
            )}
          </span>
        </Fragment>
      ))}
    </nav>
  )
}
