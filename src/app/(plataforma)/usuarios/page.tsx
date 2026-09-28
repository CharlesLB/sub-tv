import type { Metadata } from 'next'
import { Suspense } from 'react'
import { routes } from '@/lib/routes'
import { PageFrame } from '@/modules/audit'
import { UsersScreen, UsersSkeleton } from '@/modules/auth'
import { ContextBar } from '@/modules/platform'

export const metadata: Metadata = { title: 'Usuários' }

export default function UsersPage() {
  return (
    <>
      <ContextBar crumbs={[{ label: 'Registro', href: routes.auditLog() }, { label: 'Usuários' }]} title="Usuários" />
      <PageFrame>
        <Suspense fallback={<UsersSkeleton />}>
          <UsersScreen />
        </Suspense>
      </PageFrame>
    </>
  )
}
