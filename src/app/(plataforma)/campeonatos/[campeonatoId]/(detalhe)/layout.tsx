import { notFound } from 'next/navigation'
import { type ReactNode, Suspense } from 'react'
import { CHAMPIONSHIPS_PATH, routes } from '@/lib/routes'
import { isUuid } from '@/lib/utils/is-uuid/is-uuid'
import { getCurrentUser } from '@/modules/auth'
import { ChampionshipDetailSkeleton, ChampionshipTabs, getChampionshipHeader, getChampionshipsOfYear, getSeasonYears, NewMatchButton, toRibbonItems } from '@/modules/championships'
import { ContextBar, SeasonRail, SeasonRailSkeleton } from '@/modules/platform'

async function ChampionshipFrame({ seasonId, children }: { seasonId: string; children: ReactNode }) {
  const header = isUuid(seasonId) ? await getChampionshipHeader(seasonId) : null
  if (!header) notFound()

  const [years, championships, user] = await Promise.all([getSeasonYears(), getChampionshipsOfYear(header.year), getCurrentUser()])

  const crumbs = [
    { label: 'Campeonatos', href: routes.championships(header.year) },
    { label: header.name },
    { label: String(header.year), separator: '·' as const, href: routes.championships(header.year) },
  ]

  return (
    <>
      <ContextBar
        crumbs={crumbs}
        title={header.name}
        category={header.category}
        detail={`${header.statusLine} · ${header.teamCount} Times`}
        actions={user ? <NewMatchButton seasonId={header.id} /> : null}
      />
      <SeasonRail years={years} activeYear={header.year} championships={toRibbonItems(championships)} activeChampionshipId={header.id} basePath={CHAMPIONSHIPS_PATH} />
      <ChampionshipTabs seasonId={header.id} />
      {children}
    </>
  )
}

export default function ChampionshipDetailLayout({ children, params }: LayoutProps<'/campeonatos/[campeonatoId]'>) {
  const fallback = (
    <>
      <ContextBar crumbs={[{ label: 'Campeonatos', href: routes.championships() }]} title="Campeonato" />
      <SeasonRailSkeleton />
      <ChampionshipDetailSkeleton />
    </>
  )

  return (
    <Suspense fallback={fallback}>
      {params.then(({ campeonatoId }) => (
        <ChampionshipFrame seasonId={campeonatoId}>{children}</ChampionshipFrame>
      ))}
    </Suspense>
  )
}
