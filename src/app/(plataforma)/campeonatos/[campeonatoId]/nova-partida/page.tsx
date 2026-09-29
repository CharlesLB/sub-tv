import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { routes } from '@/lib/routes'
import { isUuid } from '@/lib/utils/is-uuid/is-uuid'
import { getChampionshipHeader } from '@/modules/championships'
import { NewMatchSetup, NewMatchWizardSkeleton } from '@/modules/matches'
import { ContextBar } from '@/modules/platform'

export const metadata: Metadata = { title: 'Nova partida' }

const PAGE_LABEL = 'Nova partida'

async function NewMatchScreen({ seasonId, prefillMatchId }: { seasonId: string; prefillMatchId: string | null }) {
  if (!isUuid(seasonId)) notFound()
  const header = await getChampionshipHeader(seasonId)
  if (!header) notFound()

  return (
    <>
      <ContextBar
        crumbs={[{ label: 'Campeonatos', href: routes.championships(header.year) }, { label: header.name, href: routes.championship(header.id) }, { label: PAGE_LABEL }]}
        title={header.name}
        category={header.category}
        detail={header.statusLine}
      />
      <NewMatchSetup seasonId={seasonId} prefillMatchId={prefillMatchId} presentation="page" />
    </>
  )
}

export default function NewMatchPage({ params, searchParams }: PageProps<'/campeonatos/[campeonatoId]/nova-partida'>) {
  const fallback = (
    <>
      <ContextBar crumbs={[{ label: 'Campeonatos', href: routes.championships() }, { label: PAGE_LABEL }]} title={PAGE_LABEL} />
      <NewMatchWizardSkeleton presentation="page" />
    </>
  )

  return (
    <Suspense fallback={fallback}>
      {Promise.all([params, searchParams]).then(([{ campeonatoId }, { partida }]) => (
        <NewMatchScreen seasonId={campeonatoId} prefillMatchId={typeof partida === 'string' && isUuid(partida) ? partida : null} />
      ))}
    </Suspense>
  )
}
