'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui/icon/icon'
import { liveChipStyles as styles } from './live-chip.styles'

type LiveChipProps = {
  matchId: string
  matchup: string
  closeBroadcast: () => Promise<void>
}

export function LiveChip({ matchId, matchup, closeBroadcast }: LiveChipProps) {
  const pathname = usePathname()
  const isOnLive = pathname === routes.live(matchId)

  return (
    <>
      <Link href={routes.live(matchId)} title="Voltar à transmissão" className={cn(styles.link, isOnLive ? styles.linkOnLive : styles.linkElsewhere)}>
        <span className={styles.liveDot} />
        <span className={styles.matchup}>{matchup}</span>
      </Link>
      <form action={closeBroadcast} className={styles.closeForm}>
        <button type="submit" title="Fechar transmissão" aria-label="Fechar transmissão" className={styles.closeButton}>
          <Icon name="close" size={17} />
        </button>
      </form>
    </>
  )
}
