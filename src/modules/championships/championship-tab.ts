export const CHAMPIONSHIP_TAB = {
  STANDINGS: 'classificacao',
  STATISTICS: 'estatisticas',
  MATCHES: 'partidas',
} as const

export type ChampionshipTab = (typeof CHAMPIONSHIP_TAB)[keyof typeof CHAMPIONSHIP_TAB]

export const CHAMPIONSHIP_TABS: readonly { tab: ChampionshipTab; label: string }[] = [
  { tab: CHAMPIONSHIP_TAB.STANDINGS, label: 'Classificação e rodada' },
  { tab: CHAMPIONSHIP_TAB.STATISTICS, label: 'Estatísticas' },
  { tab: CHAMPIONSHIP_TAB.MATCHES, label: 'Partidas' },
]

export const parseChampionshipTab = (value: unknown): ChampionshipTab => CHAMPIONSHIP_TABS.find((entry) => entry.tab === value)?.tab ?? CHAMPIONSHIP_TAB.STANDINGS
