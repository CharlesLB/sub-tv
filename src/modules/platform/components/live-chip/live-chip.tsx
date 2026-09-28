'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/ui/icon/icon'
import { cn } from '@/lib/utils/cn'
import { routes } from '@/lib/routes'

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
      <Link
        href={routes.live(matchId)}
        title="Voltar à transmissão"
        className={cn(
          'flex h-[34px] flex-none items-center gap-[9px] rounded-card border px-3 text-tx mobile:hidden',
          isOnLive ? 'border-ac bg-pan2' : 'border-bd bg-transparent',
        )}
      >
        <span className="size-2 flex-none animate-live-dot rounded-full bg-ac" />
        <span className="max-w-[220px] truncate text-[11.3px] font-bold tracking-[-.01em] narrow:max-w-[110px]">{matchup}</span>
      </Link>
      <form action={closeBroadcast} className="mobile:hidden">
        <button
          type="submit"
          title="Fechar transmissão"
          aria-label="Fechar transmissão"
          className="flex size-8 flex-none items-center justify-center rounded-card border border-bd2 bg-transparent text-tx4 hover:border-tx hover:text-tx"
        >
          <Icon name="close" size={17} />
        </button>
      </form>
    </>
  )
}
