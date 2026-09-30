type QueryValue = string | number | null | undefined

const withQuery = <TPath extends string>(path: TPath, query: Record<string, QueryValue>): TPath | `${TPath}?${string}` => {
  const search = new URLSearchParams(Object.entries(query).flatMap(([key, value]) => (value === null || value === undefined || value === '' ? [] : [[key, String(value)]]))).toString()

  return search ? `${path}?${search}` : path
}

export const SEASON_PARAMETER = 'temporada'
export const TAB_PARAMETER = 'aba'
export const CATEGORY_PARAMETER = 'cat'
export const TEAM_PARAMETER = 'time'
export const PLAYER_PARAMETER = 'atleta'
export const SEASONS_PARAMETER = 'temporadas'
export const MATCH_PARAMETER = 'partida'

export const USER_PARAMETER = 'usuario'
export const ACTION_PARAMETER = 'acao'
export const ENTITY_PARAMETER = 'entidade'
export const PERIOD_PARAMETER = 'periodo'
export const PAGE_PARAMETER = 'pagina'

export const CHAMPIONSHIPS_PATH = '/campeonatos'
export const SQUADS_PATH = '/elencos'

export const routes = {
  home: () => '/' as const,
  login: () => '/entrar' as const,
  championships: (year?: number) => withQuery(CHAMPIONSHIPS_PATH, { [SEASON_PARAMETER]: year }),
  championship: (seasonId: string, tab?: string) => withQuery(`/campeonatos/${seasonId}` as const, { [TAB_PARAMETER]: tab }),
  newMatch: (seasonId: string, matchId?: string) => withQuery(`/campeonatos/${seasonId}/nova-partida` as const, { [MATCH_PARAMETER]: matchId }),
  live: (matchId: string) => `/ao-vivo/${matchId}` as const,
  squads: (query: { year?: number | undefined; category?: string | undefined; teamKey?: string | undefined; playerId?: string | undefined } = {}) =>
    withQuery(query.year === undefined ? SQUADS_PATH : (`${SQUADS_PATH}/${String(query.year)}` as const), {
      [CATEGORY_PARAMETER]: query.category,
      [TEAM_PARAMETER]: query.teamKey,
      [PLAYER_PARAMETER]: query.playerId,
    }),
  history: (query: { category?: string | undefined; years?: string | undefined } = {}) => withQuery('/historico', { [CATEGORY_PARAMETER]: query.category, [SEASONS_PARAMETER]: query.years }),
  teamHistory: (teamKey: string, query: { category?: string | undefined; years?: string | undefined } = {}) =>
    withQuery(`/historico/times/${teamKey}` as const, { [CATEGORY_PARAMETER]: query.category, [SEASONS_PARAMETER]: query.years }),
  athleteHistory: (playerId: string, query: { category?: string | undefined; years?: string | undefined } = {}) =>
    withQuery(`/historico/atletas/${playerId}` as const, { [CATEGORY_PARAMETER]: query.category, [SEASONS_PARAMETER]: query.years }),
  auditLog: (query: { userId?: string | undefined; action?: string | undefined; entityType?: string | undefined; period?: string | undefined; page?: number | undefined } = {}) =>
    withQuery('/registro', {
      [USER_PARAMETER]: query.userId,
      [ACTION_PARAMETER]: query.action,
      [ENTITY_PARAMETER]: query.entityType,
      [PERIOD_PARAMETER]: query.period,
      [PAGE_PARAMETER]: query.page,
    }),
  users: () => '/usuarios' as const,
}

export type AppHref = ReturnType<(typeof routes)[keyof typeof routes]>

export const apiRoutes = {
  liveStream: (matchId: string) => `/api/partidas/${matchId}/stream` as const,
}

export const LOGIN_RETURN_PARAMETER = 'para'

export const signInRoutes = {
  signInTo: (destination: string) => withQuery('/entrar', { [LOGIN_RETURN_PARAMETER]: destination }),
}
