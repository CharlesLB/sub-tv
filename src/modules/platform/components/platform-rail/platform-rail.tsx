'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { routes, SEASON_PARAMETER } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui/icon/icon'
import type { IconName } from '@/components/ui/icon/icon-paths'
import { BrandLogo } from '../brand-logo/brand-logo'
import { platformRailStyles as styles } from './platform-rail.styles'

const LIVE_PATH_PREFIX = '/ao-vivo'

type Destination = {
  name: string
  label: string
  title: string
  icon: IconName
  pathPrefix: string
  href: (year: number | undefined) => Route
}

const DESTINATIONS: readonly Destination[] = [
  { name: 'Campeonatos', label: 'Campeo.', title: 'Torneios, tabelas e partidas', icon: 'trophy', pathPrefix: '/campeonatos', href: (year) => routes.championships(year) },
  { name: 'Elencos', label: 'Elencos', title: 'Times e elencos por categoria', icon: 'groups', pathPrefix: '/elencos', href: (year) => routes.squads({ year }) },
  { name: 'Histórico', label: 'Histórico', title: 'Estatísticas de todas as temporadas', icon: 'queryStats', pathPrefix: '/historico', href: () => routes.history() },
]

type PlatformRailProps = { liveMatchId: string | null }

export function PlatformRail({ liveMatchId }: PlatformRailProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const requestedYear = Number(searchParams.get(SEASON_PARAMETER))
  const year = Number.isInteger(requestedYear) && requestedYear > 0 ? requestedYear : undefined
  const isOnLive = pathname.startsWith(LIVE_PATH_PREFIX)

  return (
    <nav aria-label="Principal" className={styles.rail}>
      <div className={styles.brand}>
        <BrandLogo />
      </div>
      <div className={styles.destinations}>
        {DESTINATIONS.map((destination) => {
          const isActive = pathname.startsWith(destination.pathPrefix)

          return (
            <Link
              key={destination.pathPrefix}
              href={destination.href(year)}
              title={destination.title}
              aria-label={destination.name}
              aria-current={isActive ? 'page' : undefined}
              className={cn(styles.destinationBox, styles.destination, styles.destinationMobile, isActive && styles.destinationActive)}
            >
              <Icon name={destination.icon} size={22} className={cn(styles.destinationIcon, isActive ? styles.destinationIconActive : styles.destinationIconIdle)} />
              <span className={cn(styles.destinationLabel, isActive ? styles.destinationLabelActive : styles.destinationLabelIdle)}>{destination.label}</span>
            </Link>
          )
        })}
      </div>
      {liveMatchId ? (
        <Link
          href={routes.live(liveMatchId)}
          title="Voltar à transmissão"
          aria-current={isOnLive ? 'page' : undefined}
          className={cn(styles.liveLink, styles.liveLinkMobile, isOnLive && styles.liveLinkActive)}
        >
          <span className={styles.liveDot} />
          <span className={styles.liveLabel}>Ao vivo</span>
        </Link>
      ) : null}
    </nav>
  )
}
