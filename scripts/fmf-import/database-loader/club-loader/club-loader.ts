import { sql } from 'drizzle-orm'
import * as R from 'remeda'
import { clubs, seasonTeams } from '../../../../src/lib/db/schema'
import { deriveAbbreviation, deriveClubColor, deriveDisplayName } from '../../club-defaults/club-defaults'
import type { TeamReference } from '../../competition-page/page-sections/page-sections'
import { canonicalCrestId, isAliasCrest } from '../../constants/club-aliases'
import { FMF_CREST_BASE_URL } from '../../constants/fmf-sources'
import { type EditionBundle, sumulaOfMatch } from '../../edition-bundle/edition-bundle'
import type { Transaction } from '../database-context/database-context'

export type SeasonTeamLookup = Map<string, { clubId: string; seasonTeamId: string }>

const collectTeams = (bundle: EditionBundle): TeamReference[] =>
  R.uniqueBy([...bundle.page.standings.map((row) => row.team), ...bundle.page.matches.flatMap((match) => [match.home, match.away])], (team) => team.crestId)

const collectOfficialNames = (bundle: EditionBundle): Map<string, string> =>
  new Map(
    bundle.page.matches.flatMap((match) => {
      const header = sumulaOfMatch(bundle, match.sumulaUrl)?.parsed?.header
      if (!header) return []

      return [
        [match.home.crestId, header.homeName],
        [match.away.crestId, header.awayName],
      ].filter((entry): entry is [string, string] => (entry[1] ?? '').length > 0)
    }),
  )

const collectGroups = (bundle: EditionBundle): Map<string, string> => {
  const firstPhase = bundle.page.standings[0]?.phase

  return new Map(bundle.page.standings.filter((row) => row.phase === firstPhase && row.groupName !== null).map((row): [string, string] => [row.team.crestId, row.groupName ?? '']))
}

export const upsertClubsAndSeasonTeams = async (transaction: Transaction, bundle: EditionBundle, seasonId: string): Promise<SeasonTeamLookup> => {
  const teams = collectTeams(bundle)
  const officialNames = collectOfficialNames(bundle)
  const groups = collectGroups(bundle)
  if (teams.length === 0) return new Map()

  const buildClubRow = (team: TeamReference) => {
    const officialName = officialNames.get(team.crestId) ?? null
    const displayName = deriveDisplayName(team.shortName, officialName)

    return {
      fmfCrestId: canonicalCrestId(team.crestId),
      shortName: team.shortName,
      officialName,
      displayName,
      abbreviation: deriveAbbreviation(displayName),
      color: deriveClubColor(canonicalCrestId(team.crestId)),
      crestUrl: `${FMF_CREST_BASE_URL}${team.crestFileName}`,
    }
  }

  const nativeTeams = teams.filter((team) => !isAliasCrest(team.crestId))
  const aliasTeams = teams.filter((team) => isAliasCrest(team.crestId))

  const nativeRows =
    nativeTeams.length === 0
      ? []
      : await transaction
          .insert(clubs)
          .values(nativeTeams.map(buildClubRow))
          .onConflictDoUpdate({
            target: clubs.fmfCrestId,
            set: {
              shortName: sql`excluded.short_name`,
              officialName: sql`coalesce(excluded.official_name, ${clubs.officialName})`,
              crestUrl: sql`excluded.crest_url`,
              displayName: sql`coalesce(${clubs.displayName}, excluded.display_name)`,
              abbreviation: sql`coalesce(${clubs.abbreviation}, excluded.abbreviation)`,
              color: sql`coalesce(${clubs.color}, excluded.color)`,
              updatedAt: sql`now()`,
            },
          })
          .returning({ id: clubs.id, crestId: clubs.fmfCrestId })

  const aliasRows =
    aliasTeams.length === 0
      ? []
      : await transaction
          .insert(clubs)
          .values(R.uniqueBy(aliasTeams.map(buildClubRow), (row) => row.fmfCrestId))
          .onConflictDoUpdate({ target: clubs.fmfCrestId, set: { officialName: sql`coalesce(${clubs.officialName}, excluded.official_name)`, updatedAt: sql`now()` } })
          .returning({ id: clubs.id, crestId: clubs.fmfCrestId })

  const clubRows = [...nativeRows, ...aliasRows]
  const clubIdsByCanonicalCrest = new Map(clubRows.map((row) => [row.crestId ?? '', row.id]))
  const clubIdOf = (crestId: string): string => clubIdsByCanonicalCrest.get(canonicalCrestId(crestId)) ?? ''

  const seasonTeamRows = await transaction
    .insert(seasonTeams)
    .values(
      R.uniqueBy(
        teams.map((team) => ({ seasonId, clubId: clubIdOf(team.crestId), groupName: groups.get(team.crestId) ?? null })),
        (row) => row.clubId,
      ),
    )
    .onConflictDoUpdate({ target: [seasonTeams.seasonId, seasonTeams.clubId], set: { groupName: sql`excluded.group_name`, updatedAt: sql`now()` } })
    .returning({ id: seasonTeams.id, clubId: seasonTeams.clubId })

  const seasonTeamIds = new Map(seasonTeamRows.map((row) => [row.clubId, row.id]))

  return new Map(
    teams.map((team) => {
      const clubId = clubIdOf(team.crestId)

      return [team.crestId, { clubId, seasonTeamId: seasonTeamIds.get(clubId) ?? '' }]
    }),
  )
}
