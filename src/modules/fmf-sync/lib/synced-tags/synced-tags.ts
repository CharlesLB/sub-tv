import { tags } from '@/lib/cache/tags'

export const syncedTagsOf = (touchedSeasonIds: readonly string[]): string[] => [
  tags.fmfData(),
  tags.seasons(),
  tags.history(),
  ...touchedSeasonIds.flatMap((seasonId) => [tags.season(seasonId), tags.seasonMatches(seasonId), tags.seasonTeams(seasonId)]),
]
