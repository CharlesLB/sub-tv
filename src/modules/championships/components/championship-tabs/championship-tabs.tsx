'use client'

import { useSearchParams } from 'next/navigation'
import { routes, TAB_PARAMETER } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { IntentLink } from '@/components/ui/intent-link/intent-link'
import { CHAMPIONSHIP_TABS, parseChampionshipTab } from '../../lib/championship-tab/championship-tab'
import { championshipTabsStyles as styles } from './championship-tabs.styles'

export function ChampionshipTabs({ seasonId }: { seasonId: string }) {
  const activeTab = parseChampionshipTab(useSearchParams().get(TAB_PARAMETER))

  return (
    <nav aria-label="Seções do campeonato" className={styles.navigation}>
      {CHAMPIONSHIP_TABS.map((entry) => {
        const isActive = entry.tab === activeTab

        return (
          <IntentLink
            shouldPrefetchOnView
            key={entry.tab}
            href={routes.championship(seasonId, entry.tab)}
            scroll={false}
            aria-current={isActive ? 'page' : undefined}
            className={cn(styles.tab, isActive ? styles.tabActive : styles.tabIdle)}
          >
            {entry.label}
          </IntentLink>
        )
      })}
    </nav>
  )
}
