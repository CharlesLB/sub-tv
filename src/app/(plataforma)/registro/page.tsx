import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AuditLogScreen, AuditLogSkeleton, UsersLink } from '@/modules/audit'
import { requireUser } from '@/modules/auth'
import { ContextBar, PageFrame } from '@/modules/platform'

export const metadata: Metadata = { title: 'Registro de alterações' }

const renderAuditLog = async (query: Record<string, string | string[] | undefined>) => {
  await requireUser()

  return <AuditLogScreen query={query} />
}

export default function AuditLogPage({ searchParams }: PageProps<'/registro'>) {
  return (
    <>
      <ContextBar crumbs={[{ label: 'Registro' }]} title="Registro de alterações" actions={<UsersLink />} />
      <PageFrame>
        <Suspense fallback={<AuditLogSkeleton />}>{searchParams.then(renderAuditLog)}</Suspense>
      </PageFrame>
    </>
  )
}
