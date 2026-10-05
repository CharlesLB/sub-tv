import { Suspense } from 'react'
import { CATEGORY_PARAMETER, PLAYER_PARAMETER, TEAM_PARAMETER } from '@/lib/routes'
import { getSeasonYears, resolveYear } from '@/modules/championships'
import { SquadPanel, SquadWorkspaceSkeleton } from '@/modules/players'
import { getSeasonTeams } from '@/modules/teams'

type SquadQuery = { requestedYear: string; category: string | undefined; teamKey: string | undefined; playerId: string | undefined }

const readParameter = (value: string | string[] | undefined): string | undefined => (typeof value === 'string' ? value : undefined)

async function SquadOfSelectedTeam({ query }: { query: SquadQuery }) {
  const year = resolveYear(query.requestedYear, await getSeasonYears())
  const teams = await getSeasonTeams(year)

  return <SquadPanel year={year} teams={teams} query={{ category: query.category, teamKey: query.teamKey }} requestedPlayerId={query.playerId} />
}

export default function SquadsSeasonPage({ params, searchParams }: PageProps<'/elencos/[temporada]'>) {
  return (
    <Suspense fallback={<SquadWorkspaceSkeleton />}>
      {Promise.all([params, searchParams]).then(([{ temporada }, query]) => (
        <SquadOfSelectedTeam
          query={{ requestedYear: temporada, category: readParameter(query[CATEGORY_PARAMETER]), teamKey: readParameter(query[TEAM_PARAMETER]), playerId: readParameter(query[PLAYER_PARAMETER]) }}
        />
      ))}
    </Suspense>
  )
}
