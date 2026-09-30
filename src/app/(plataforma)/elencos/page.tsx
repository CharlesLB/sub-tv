import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { CATEGORY_PARAMETER, PLAYER_PARAMETER, routes, SEASON_PARAMETER, TEAM_PARAMETER } from '@/lib/routes'
import { getSeasonYears, resolveYear } from '@/modules/championships'
import { ContextBar, SeasonRailSkeleton } from '@/modules/platform'
import { SQUADS_BASE_CRUMB_LABEL, SQUADS_TITLE, SquadsSeasonRedirect, SquadsSkeleton } from '@/modules/players'

export const metadata: Metadata = { title: SQUADS_TITLE }

type SquadsQuery = Record<string, string | string[] | undefined>

const readParameter = (value: string | string[] | undefined): string | undefined => (typeof value === 'string' ? value : undefined)

const squadsFallback = (
  <>
    <ContextBar crumbs={[{ label: SQUADS_BASE_CRUMB_LABEL }]} title={SQUADS_TITLE} />
    <SeasonRailSkeleton />
    <SquadsSkeleton />
  </>
)

async function SquadsEntry({ query }: { query: SquadsQuery }) {
  const years = await getSeasonYears()
  const requestedYear = readParameter(query[SEASON_PARAMETER])
  const selection = { category: readParameter(query[CATEGORY_PARAMETER]), teamKey: readParameter(query[TEAM_PARAMETER]), playerId: readParameter(query[PLAYER_PARAMETER]) }
  const knownYears = years.map((seasonYear) => seasonYear.year)

  if (knownYears.some((year) => String(year) === requestedYear)) redirect(routes.squads({ year: Number(requestedYear), ...selection }))

  return (
    <>
      {squadsFallback}
      <SquadsSeasonRedirect knownYears={knownYears} fallbackYear={resolveYear(undefined, years)} query={selection} />
    </>
  )
}

export default function SquadsEntryPage({ searchParams }: PageProps<'/elencos'>) {
  return (
    <Suspense fallback={squadsFallback}>
      {searchParams.then((query) => (
        <SquadsEntry query={query} />
      ))}
    </Suspense>
  )
}
