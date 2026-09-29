import type { Metadata } from 'next'
import { Suspense } from 'react'
import { HISTORY_OVERVIEW_TITLE, HistoryOverviewScreen, HistoryOverviewScreenSkeleton } from '@/modules/history'
import { ContextBar } from '@/modules/platform'

export const metadata: Metadata = { title: 'Histórico' }

export default function HistoryPage({ searchParams }: PageProps<'/historico'>) {
  const fallback = (
    <>
      <ContextBar crumbs={[{ label: 'Histórico' }]} title={HISTORY_OVERVIEW_TITLE} />
      <HistoryOverviewScreenSkeleton />
    </>
  )

  return (
    <Suspense fallback={fallback}>
      {searchParams.then((query) => (
        <HistoryOverviewScreen query={query} />
      ))}
    </Suspense>
  )
}
