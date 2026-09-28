import Link from 'next/link'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { CHAMPIONSHIP_TABS, type ChampionshipTab } from '../../championship-tab'
import { championshipTabsStyles as styles } from './championship-tabs.styles'

type ChampionshipTabsProps = { seasonId: string; activeTab: ChampionshipTab }

export function ChampionshipTabs({ seasonId, activeTab }: ChampionshipTabsProps) {
  return (
    <nav aria-label="Seções do campeonato" className={styles.navigation}>
      {CHAMPIONSHIP_TABS.map((entry) => {
        const isActive = entry.tab === activeTab

        return (
          <Link
            key={entry.tab}
            href={routes.championship(seasonId, entry.tab)}
            scroll={false}
            aria-current={isActive ? 'page' : undefined}
            className={cn(styles.tab, isActive ? styles.tabActive : styles.tabIdle)}
          >
            {entry.label}
          </Link>
        )
      })}
    </nav>
  )
}
