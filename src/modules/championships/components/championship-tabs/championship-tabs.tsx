import Link from 'next/link'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { CHAMPIONSHIP_TABS, type ChampionshipTab } from '../../championship-tab'

type ChampionshipTabsProps = { seasonId: string; activeTab: ChampionshipTab }

export function ChampionshipTabs({ seasonId, activeTab }: ChampionshipTabsProps) {
  return (
    <nav aria-label="Seções do campeonato" className="flex flex-none flex-wrap gap-1 border-b border-bd bg-pan px-5 pt-[14px] pb-3 mobile:px-3">
      {CHAMPIONSHIP_TABS.map((entry) => {
        const isActive = entry.tab === activeTab

        return (
          <Link
            key={entry.tab}
            href={routes.championship(seasonId, entry.tab)}
            scroll={false}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'border-b-2 px-[14px] py-2 text-[11.3px] leading-[1.3] font-bold tracking-[-.01em] whitespace-nowrap transition-[color,border-color] duration-200',
              isActive ? 'border-ac text-tx' : 'border-transparent text-tx4 hover:text-tx2',
            )}
          >
            {entry.label}
          </Link>
        )
      })}
    </nav>
  )
}
