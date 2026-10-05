import type { Metadata } from 'next'
import { Suspense } from 'react'
import { routes } from '@/lib/routes'
import { ChampionshipList, ChampionshipListSkeleton, getCategoryClubs, getChampionshipsOfYear, getSeasonYears, resolveYear, toRibbonItems } from '@/modules/championships'
import { ContextBar, SeasonRail, SeasonRailSkeleton } from '@/modules/platform'

export const metadata: Metadata = { title: 'Campeonatos' }

const TITLE = 'Todos os campeonatos'

async function ChampionshipsOverview({ requestedYear }: { requestedYear: string | undefined }) {
  const years = await getSeasonYears()
  const year = resolveYear(requestedYear, years)
  const [championships, clubs] = await Promise.all([getChampionshipsOfYear(year), getCategoryClubs()])

  return (
    <>
      <ContextBar crumbs={[{ label: 'Campeonatos' }, { label: String(year), separator: '·' }]} title={TITLE} />
      <SeasonRail years={years} activeYear={year} championships={toRibbonItems(championships)} basePath="/campeonatos" />
      <ChampionshipList championships={championships} year={year} clubs={clubs} />
    </>
  )
}

export default function ChampionshipsPage({ searchParams }: PageProps<'/campeonatos'>) {
  const fallback = (
    <>
      <ContextBar crumbs={[{ label: 'Campeonatos', href: routes.championships() }]} title={TITLE} />
      <SeasonRailSkeleton />
      <ChampionshipListSkeleton />
    </>
  )

  return (
    <Suspense fallback={fallback}>
      {searchParams.then(({ temporada }) => (
        <ChampionshipsOverview requestedYear={typeof temporada === 'string' ? temporada : undefined} />
      ))}
    </Suspense>
  )
}
