import { CATEGORY_PARAMETER, CHAMPIONSHIPS_PATH, routes, SQUADS_PATH } from '@/lib/routes'

export type SeasonBasePath = typeof CHAMPIONSHIPS_PATH | typeof SQUADS_PATH

export type SeasonHref = ReturnType<typeof routes.championships> | ReturnType<typeof routes.squads>

type SeasonHrefInput = { searchParams: URLSearchParams; year: number }

export const SEASON_HREF_BUILDERS: Readonly<Record<SeasonBasePath, (input: SeasonHrefInput) => SeasonHref>> = {
  [CHAMPIONSHIPS_PATH]: ({ year }) => routes.championships(year),
  [SQUADS_PATH]: ({ searchParams, year }) => routes.squads({ year, category: searchParams.get(CATEGORY_PARAMETER) ?? undefined }),
}
