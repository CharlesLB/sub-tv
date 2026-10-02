import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { type ReactNode, Suspense } from 'react'
import { routes, SQUADS_PATH } from '@/lib/routes'
import { getChampionshipsOfYear, getSeasonYears, resolveYear, toRibbonItems } from '@/modules/championships'
import { ContextBar, SeasonRail, SeasonRailSkeleton } from '@/modules/platform'
import { SQUADS_BASE_CRUMB_LABEL, SQUADS_TITLE, SquadsScreen, SquadsSkeleton } from '@/modules/players'
import { getSeasonTeams, SelectedTeamCategory } from '@/modules/teams'

export const metadata: Metadata = { title: SQUADS_TITLE }

async function SquadsSeason({ requestedYear, children }: { requestedYear: string; children: ReactNode }) {
  const years = await getSeasonYears()
  const year = resolveYear(requestedYear, years)
  if (String(year) !== requestedYear) redirect(routes.squads({ year }))

  const [championships, teams] = await Promise.all([getChampionshipsOfYear(year), getSeasonTeams(year)])

  return (
    <>
      <ContextBar
        crumbs={[{ label: SQUADS_BASE_CRUMB_LABEL }, { label: String(year), separator: '·' }]}
        title={SQUADS_TITLE}
        categoryTag={<SelectedTeamCategory teams={teams} />}
        detail={`Vínculos por clube e categoria · elenco ${year}`}
      />
      <SeasonRail years={years} activeYear={year} championships={toRibbonItems(championships)} basePath={SQUADS_PATH} />
      <SquadsScreen year={year} teams={teams}>
        {children}
      </SquadsScreen>
    </>
  )
}

export default function SquadsSeasonLayout({ children, params }: LayoutProps<'/elencos/[temporada]'>) {
  const fallback = (
    <>
      <ContextBar crumbs={[{ label: SQUADS_BASE_CRUMB_LABEL }]} title={SQUADS_TITLE} />
      <SeasonRailSkeleton />
      <SquadsSkeleton />
    </>
  )

  return (
    <Suspense fallback={fallback}>
      {params.then(({ temporada }) => (
        <SquadsSeason requestedYear={temporada}>{children}</SquadsSeason>
      ))}
    </Suspense>
  )
}
