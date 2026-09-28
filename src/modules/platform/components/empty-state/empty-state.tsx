import type { Route } from 'next'
import Link from 'next/link'

type EmptyStateProps = {
  title: string
  description: string
  action?: { label: string; href: Route }
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="flex max-w-[420px] flex-col items-center gap-3 rounded-card border border-bd bg-pan px-6 py-7 text-center">
        <span aria-hidden className="h-[34px] w-7 bg-bd2 hexagon" />
        <span className="text-[15.3px] font-bold tracking-[-.01em]">{title}</span>
        <span className="text-[12.5px] leading-normal text-tx3">{description}</span>
        {action ? (
          <Link href={action.href} className="mt-1 flex h-[38px] items-center rounded-card bg-ac px-4 text-[11.3px] font-bold tracking-[-.01em] text-bg">
            {action.label}
          </Link>
        ) : null}
      </div>
    </div>
  )
}
