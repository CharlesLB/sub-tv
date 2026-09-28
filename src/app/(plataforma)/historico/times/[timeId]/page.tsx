import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { routes } from '@/lib/routes'
import { HistoryDetailSkeleton, TeamHistoryScreen } from '@/modules/history'
import { ContextBar } from '@/modules/platform'
import { parseTeamKey } from '@/modules/teams'

export const metadata: Metadata = { title: 'Histórico do time' }

const renderTeamHistory = (timeId: string, query: Record<string, string | string[] | undefined>) => {
  if (!parseTeamKey(timeId)) notFound()

  return <TeamHistoryScreen teamKey={timeId} query={query} />
}

export default function TeamHistoryPage({ params, searchParams }: PageProps<'/historico/times/[timeId]'>) {
  const fallback = (
    <>
      <ContextBar crumbs={[{ label: 'Histórico', href: routes.history() }, { label: 'Time' }]} title="Histórico do time" />
      <HistoryDetailSkeleton />
    </>
  )

  return <Suspense fallback={fallback}>{Promise.all([params, searchParams]).then(([{ timeId }, query]) => renderTeamHistory(timeId, query))}</Suspense>
}
