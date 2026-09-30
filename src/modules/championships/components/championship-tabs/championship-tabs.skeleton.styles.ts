import { CHAMPIONSHIP_TAB, type ChampionshipTab } from '../../lib/championship-tab/championship-tab'

export const championshipTabsSkeletonStyles = {
  label: 'h-lh',
  labelWidth: {
    [CHAMPIONSHIP_TAB.STANDINGS]: 'w-[141px]',
    [CHAMPIONSHIP_TAB.STATISTICS]: 'w-[71px]',
    [CHAMPIONSHIP_TAB.MATCHES]: 'w-[51px]',
  } satisfies Record<ChampionshipTab, string>,
} as const
