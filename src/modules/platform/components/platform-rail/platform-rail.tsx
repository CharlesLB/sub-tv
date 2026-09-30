'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { routes, SEASON_PARAMETER, SQUADS_PATH } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui/icon/icon'
import type { IconName } from '@/components/ui/icon/icon-paths'
import { LinkPendingIndicator } from '@/components/ui/link-pending-indicator/link-pending-indicator'
import { BrandLogo } from '../brand-logo/brand-logo'
import { platformRailStyles as styles } from './platform-rail.styles'

const LIVE_PATH_PREFIX = '/ao-vivo'

type DestinationHref = ReturnType<typeof routes.championships> | ReturnType<typeof routes.squads> | ReturnType<typeof routes.history>

type Destination = {
  name: string
  label: string
  title: string
  icon: IconName
  pathPrefix: string
  href: (year: number | undefined) => DestinationHref
}

const DESTINATIONS: readonly Destination[] = [
  { name: 'Campeonatos', label: 'Campeo.', title: 'Torneios, tabelas e partidas', icon: 'trophy', pathPrefix: '/campeonatos', href: (year) => routes.championships(year) },
  { name: 'Elencos', label: 'Elencos', title: 'Times e elencos por categoria', icon: 'groups', pathPrefix: '/elencos', href: (year) => routes.squads({ year }) },
  { name: 'Histórico', label: 'Histórico', title: 'Estatísticas de todas as temporadas', icon: 'queryStats', pathPrefix: '/historico', href: () => routes.history() },
]

const SQUADS_SEASON_PREFIX = `${SQUADS_PATH}/`

const toSeasonYear = (value: string | null | undefined): number | undefined => {
  const year = Number(value)

  return Number.isInteger(year) && year > 0 ? year : undefined
}

const seasonOfPath = (pathname: string): string | undefined => (pathname.startsWith(SQUADS_SEASON_PREFIX) ? pathname.slice(SQUADS_SEASON_PREFIX.length).split('/')[0] : undefined)

type PlatformRailProps = { liveMatchId: string | null }

export function PlatformRail({ liveMatchId }: PlatformRailProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const year = toSeasonYear(searchParams.get(SEASON_PARAMETER) ?? seasonOfPath(pathname))
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
              <LinkPendingIndicator />
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
          <LinkPendingIndicator />
        </Link>
      ) : null}
    </nav>
  )
}
