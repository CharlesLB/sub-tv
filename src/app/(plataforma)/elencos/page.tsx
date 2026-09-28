import type { Metadata } from 'next'
import { Suspense } from 'react'
import {
  getChampionshipsOfYear,
  getSeasonYears,
  isCategory,
  resolveYear,
  toRibbonItems,
} from '@/modules/championships'
import { getCurrentUser } from '@/modules/auth'
import { ContextBar, SeasonRail, SeasonRailSkeleton, type Crumb } from '@/modules/platform'
import { SquadsScreen, SquadsSkeleton } from '@/modules/players'
import { getSeasonTeams } from '@/modules/teams'

export const metadata: Metadata = { title: 'Elencos' }

const TITLE = 'Elencos'
const BASE_CRUMB: Crumb = { label: 'Gestão da base' }

type SquadsQuery = {
  year: string | undefined
  category: string | undefined
  teamKey: string | undefined
  playerId: string | undefined
}

const readParameter = (value: string | string[] | undefined): string | undefined =>
  typeof value === 'string' ? value : undefined

async function SquadsOverview({ query }: { query: SquadsQuery }) {
  const years = await getSeasonYears()
  const year = resolveYear(query.year, years)
  const [championships, teams, user] = await Promise.all([
    getChampionshipsOfYear(year),
    getSeasonTeams(year),
    getCurrentUser(),
  ])
  const categoryFilter = isCategory(query.category) ? query.category : undefined
  const visibleTeams = categoryFilter
    ? teams.filter((team) => team.category === categoryFilter)
    : teams
  const selectedTeam = teams.find((team) => team.key === query.teamKey) ?? visibleTeams[0] ?? null

  return (
    <>
      <ContextBar
        crumbs={[BASE_CRUMB, { label: String(year), separator: '·' }]}
        title={TITLE}
        category={selectedTeam?.category}
        detail={`Vínculos por clube e categoria · elenco ${year}`}
      />
      <SeasonRail
        years={years}
        activeYear={year}
        championships={toRibbonItems(championships)}
        basePath="/elencos"
      />
      <SquadsScreen
        year={year}
        teams={visibleTeams}
        categoryFilter={categoryFilter}
        selectedTeam={selectedTeam}
        canEdit={user !== null}
        requestedPlayerId={query.playerId}
      />
    </>
  )
}

export default function SquadsPage({ searchParams }: PageProps<'/elencos'>) {
  const fallback = (
    <>
      <ContextBar crumbs={[BASE_CRUMB]} title={TITLE} />
      <SeasonRailSkeleton />
      <SquadsSkeleton />
    </>
  )

  return (
    <Suspense fallback={fallback}>
      {searchParams.then((parameters) => (
        <SquadsOverview
          query={{
            year: readParameter(parameters.temporada),
            category: readParameter(parameters.cat),
            teamKey: readParameter(parameters.time),
            playerId: readParameter(parameters.atleta),
          }}
        />
      ))}
    </Suspense>
  )
}
