import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { routes } from '@/lib/routes'
import { isUuid } from '@/lib/utils/is-uuid/is-uuid'
import { AthleteHistoryScreen, HistoryDetailSkeleton } from '@/modules/history'
import { ContextBar } from '@/modules/platform'

export const metadata: Metadata = { title: 'Histórico do atleta' }

const renderAthleteHistory = (atletaId: string, query: Record<string, string | string[] | undefined>) => {
  if (!isUuid(atletaId)) notFound()

  return <AthleteHistoryScreen playerId={atletaId} query={query} />
}

export default function AthleteHistoryPage({ params, searchParams }: PageProps<'/historico/atletas/[atletaId]'>) {
  const fallback = (
    <>
      <ContextBar crumbs={[{ label: 'Histórico', href: routes.history() }, { label: 'Atleta' }]} title="Ficha do atleta" />
      <HistoryDetailSkeleton />
    </>
  )

  return <Suspense fallback={fallback}>{Promise.all([params, searchParams]).then(([{ atletaId }, query]) => renderAthleteHistory(atletaId, query))}</Suspense>
}
