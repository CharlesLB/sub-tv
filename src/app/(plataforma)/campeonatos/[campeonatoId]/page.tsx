import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { routes } from '@/lib/routes'
import { isUuid } from '@/lib/utils/is-uuid/is-uuid'
import {
  ChampionshipDetailSkeleton,
  ChampionshipTabContent,
  ChampionshipTabs,
  categoryLabel,
  getChampionshipHeader,
  getChampionshipsOfYear,
  getSeasonYears,
  NewMatchButton,
  parseChampionshipTab,
  toRibbonItems,
} from '@/modules/championships'
import { ContextBar, SeasonRail, SeasonRailSkeleton } from '@/modules/platform'

async function ChampionshipDetail({ seasonId, requestedTab }: { seasonId: string; requestedTab: unknown }) {
  const header = isUuid(seasonId) ? await getChampionshipHeader(seasonId) : null
  if (!header) notFound()

  const [years, championships] = await Promise.all([getSeasonYears(), getChampionshipsOfYear(header.year)])

  const crumbs = [
    { label: 'Campeonatos', href: routes.championships(header.year) },
    { label: header.name },
    { label: String(header.year), separator: '·' as const, href: routes.championships(header.year) },
  ]

  return (
    <>
      <ContextBar crumbs={crumbs} title={header.name} category={header.category} detail={`${header.statusLine} · ${header.teamCount} Times`} actions={<NewMatchButton seasonId={header.id} />} />
      <SeasonRail years={years} activeYear={header.year} championships={toRibbonItems(championships)} activeChampionshipId={header.id} basePath="/campeonatos" />
      <ChampionshipTabs seasonId={header.id} activeTab={parseChampionshipTab(requestedTab)} />
      <ChampionshipTabContent header={header} tab={parseChampionshipTab(requestedTab)} />
    </>
  )
}

export async function generateMetadata({ params }: PageProps<'/campeonatos/[campeonatoId]'>): Promise<Metadata> {
  const { campeonatoId } = await params
  const header = isUuid(campeonatoId) ? await getChampionshipHeader(campeonatoId) : null

  return { title: header ? `${header.name} ${categoryLabel[header.category]} ${header.year}` : 'Campeonato' }
}

export default function ChampionshipPage({ params, searchParams }: PageProps<'/campeonatos/[campeonatoId]'>) {
  const fallback = (
    <>
      <ContextBar crumbs={[{ label: 'Campeonatos', href: routes.championships() }]} title="Campeonato" />
      <SeasonRailSkeleton />
      <ChampionshipDetailSkeleton />
    </>
  )

  return (
    <Suspense fallback={fallback}>
      {Promise.all([params, searchParams]).then(([{ campeonatoId }, { aba }]) => (
        <ChampionshipDetail seasonId={campeonatoId} requestedTab={aba} />
      ))}
    </Suspense>
  )
}
