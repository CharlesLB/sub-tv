'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Icon } from '@/components/ui/icon/icon'
import type { IconName } from '@/components/ui/icon/icon-paths'
import { cn } from '@/lib/utils/cn'
import { SEASON_PARAMETER, routes } from '@/lib/routes'
import { BrandLogo } from '../brand-logo/brand-logo'

const LIVE_PATH_PREFIX = '/ao-vivo'

type Destination = {
  label: string
  title: string
  icon: IconName
  pathPrefix: string
  href: (year: number | undefined) => Route
}

const DESTINATIONS: readonly Destination[] = [
  { label: 'Campeo.', title: 'Torneios, tabelas e partidas', icon: 'trophy', pathPrefix: '/campeonatos', href: (year) => routes.championships(year) },
  { label: 'Elencos', title: 'Times e elencos por categoria', icon: 'groups', pathPrefix: '/elencos', href: (year) => routes.squads({ year }) },
  { label: 'Histórico', title: 'Estatísticas de todas as temporadas', icon: 'queryStats', pathPrefix: '/historico', href: () => routes.history() },
]

type PlatformRailProps = { liveMatchId: string | null }

export function PlatformRail({ liveMatchId }: PlatformRailProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const requestedYear = Number(searchParams.get(SEASON_PARAMETER))
  const year = Number.isInteger(requestedYear) && requestedYear > 0 ? requestedYear : undefined
  const isOnLive = pathname.startsWith(LIVE_PATH_PREFIX)

  return (
    <nav
      aria-label="Principal"
      className="chrome flex w-[78px] flex-none flex-col items-center gap-[14px] border-r border-bd bg-(--ch-rail) py-[14px] narrow:w-[62px] mobile:order-3 mobile:h-[60px] mobile:w-full mobile:flex-row mobile:items-stretch mobile:gap-0 mobile:border-t mobile:border-r-0 mobile:py-0"
    >
      <div className="mobile:hidden">
        <BrandLogo />
      </div>
      <div className="flex w-full flex-col items-center gap-1 mobile:min-w-0 mobile:flex-[3_1_0] mobile:flex-row mobile:items-stretch mobile:gap-0">
        {DESTINATIONS.map((destination) => {
          const isActive = pathname.startsWith(destination.pathPrefix)

          return (
            <Link
              key={destination.pathPrefix}
              href={destination.href(year)}
              title={destination.title}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex w-full flex-col items-center gap-[5px] border-l-2 border-transparent py-[10px] transition-[background,border-color] duration-150 hover:bg-pan2',
                'mobile:min-w-0 mobile:flex-[1_1_0] mobile:justify-center mobile:gap-[3px] mobile:border-t-2 mobile:border-l-0 mobile:px-[2px] mobile:py-[6px]',
                isActive && 'border-ac bg-pan2',
              )}
            >
              <Icon name={destination.icon} size={22} className={cn('transition-colors', isActive ? 'text-ac' : 'text-tx5')} />
              <span className={cn('block text-[9.5px] font-bold tracking-[-.01em] narrow:hidden mobile:block mobile:text-[9px]', isActive ? 'text-tx' : 'text-tx3')}>
                {destination.label}
              </span>
            </Link>
          )
        })}
      </div>
      {liveMatchId ? (
        <Link
          href={routes.live(liveMatchId)}
          title="Voltar à transmissão"
          aria-current={isOnLive ? 'page' : undefined}
          className={cn(
            'mt-auto flex w-full flex-col items-center gap-[6px] border-t border-l-2 border-t-bd border-l-transparent py-[10px]',
            'mobile:mt-0 mobile:min-w-0 mobile:flex-[1_1_0] mobile:justify-center mobile:gap-1 mobile:border-t-2 mobile:border-l mobile:border-t-transparent mobile:border-l-bd mobile:px-[2px] mobile:py-[6px]',
            isOnLive && 'border-l-ac bg-pan2 mobile:border-t-ac',
          )}
        >
          <span className="size-[9px] animate-live-dot rounded-full bg-ac" />
          <span className="text-[8.1px] font-bold tracking-[-.01em] text-ac">Ao vivo</span>
        </Link>
      ) : null}
    </nav>
  )
}
