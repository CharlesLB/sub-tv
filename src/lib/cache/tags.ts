export const tags = {
  fmfData: () => 'fmf-data',
  seasons: () => 'seasons',
  season: (seasonId: string) => `season:${seasonId}`,
  seasonMatches: (seasonId: string) => `season:${seasonId}:matches`,
  seasonTeams: (seasonId: string) => `season:${seasonId}:teams`,
  teamSquad: (seasonTeamId: string) => `team:${seasonTeamId}:squad`,
  player: (playerId: string) => `player:${playerId}`,
  match: (matchId: string) => `match:${matchId}`,
  liveMatches: () => 'live-matches',
  history: () => 'history',
} as const
