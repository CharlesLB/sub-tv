import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { TAB_PARAMETER } from '@/lib/routes'
import { isUuid } from '@/lib/utils/is-uuid/is-uuid'
import { ChampionshipTabContent, ChampionshipTabContentSkeleton, categoryLabel, getChampionshipHeader, parseChampionshipTab } from '@/modules/championships'

async function ChampionshipTab({ seasonId, requestedTab }: { seasonId: string; requestedTab: unknown }) {
  const header = isUuid(seasonId) ? await getChampionshipHeader(seasonId) : null
  if (!header) notFound()

  return <ChampionshipTabContent header={header} tab={parseChampionshipTab(requestedTab)} />
}

export async function generateMetadata({ params }: PageProps<'/campeonatos/[campeonatoId]'>): Promise<Metadata> {
  const { campeonatoId } = await params
  const header = isUuid(campeonatoId) ? await getChampionshipHeader(campeonatoId) : null

  return { title: header ? `${header.name} ${categoryLabel[header.category]} ${header.year}` : 'Campeonato' }
}

export default function ChampionshipPage({ params, searchParams }: PageProps<'/campeonatos/[campeonatoId]'>) {
  return (
    <Suspense fallback={<ChampionshipTabContentSkeleton />}>
      {Promise.all([params, searchParams]).then(([{ campeonatoId }, query]) => (
        <ChampionshipTab seasonId={campeonatoId} requestedTab={query[TAB_PARAMETER]} />
      ))}
    </Suspense>
  )
}
