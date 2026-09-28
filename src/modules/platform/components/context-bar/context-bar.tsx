import { type ReactNode, Suspense } from 'react'
import { UserChip } from '@/modules/auth'
import { type Category, CategoryTag } from '@/modules/championships/client'
import { Breadcrumbs, type Crumb } from '../breadcrumbs/breadcrumbs'
import { LiveBroadcastChip } from '../live-broadcast-chip/live-broadcast-chip'
import { ThemeToggle } from '../theme-toggle/theme-toggle'

type ContextBarProps = {
  crumbs: Crumb[]
  title: string
  category?: Category | undefined
  detail?: string | undefined
  actions?: ReactNode
}

export function ContextBar({ crumbs, title, category, detail, actions }: ContextBarProps) {
  return (
    <header className="flex min-h-[60px] flex-none items-center gap-[14px] border-b border-bd bg-pan px-4 chrome-dark-only text-tx narrow:gap-[10px] mobile:min-h-[54px] mobile:gap-2 mobile:px-[10px]">
      <div className="flex min-w-0 flex-col gap-[3px]">
        <Breadcrumbs crumbs={crumbs} />
        <h1 className="max-w-[46vw] truncate text-[19px] font-bold tracking-[-.01em] whitespace-nowrap narrow:max-w-[38vw] narrow:text-[16px] mobile:max-w-[44vw] mobile:text-[15px]">{title}</h1>
      </div>
      {category ? <CategoryTag category={category} size="large" className="mobile:hidden" /> : null}
      {detail ? <span className="truncate text-[11px] whitespace-nowrap text-tx4 mobile:hidden">{detail}</span> : null}
      <div className="ml-auto flex flex-none items-center gap-[9px]">
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
