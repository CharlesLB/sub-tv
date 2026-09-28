import Link from 'next/link'
import { Crest } from '@/components/ui/crest/crest'
import { Icon } from '@/components/ui/icon/icon'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { formatShortDateTime } from '@/lib/utils/format-date/format-date'
import type { ChampionshipCardVM } from '../../types'
import { CategoryTag } from '../category-tag/category-tag'

const CARD_DELAY_STEP_MS = 45

const describeStatus = (championship: ChampionshipCardVM): { text: string; meta: string } => {
  const { liveMatch, nextMatch } = championship
  if (liveMatch) {
    return { text: `${liveMatch.home.abbreviation} ${liveMatch.homeScore} × ${liveMatch.awayScore} ${liveMatch.away.abbreviation}`, meta: 'AO VIVO' }
  }
  if (nextMatch?.kickoffAt) return { text: `PRÓXIMA: ${formatShortDateTime(nextMatch.kickoffAt)}`, meta: nextMatch.round ? `R${nextMatch.round}` : '' }
  if (championship.isFinished) return { text: 'Campeonato encerrado', meta: '' }

  return { text: 'Sem partida agendada', meta: '' }
}

type ChampionshipCardProps = { championship: ChampionshipCardVM; index: number }

export function ChampionshipCard({ championship, index }: ChampionshipCardProps) {
  const isLive = championship.liveMatch !== null
  const status = describeStatus(championship)
  const href = championship.liveMatch ? routes.live(championship.liveMatch.matchId) : routes.championship(championship.id)

  return (
    <Link
      href={href}
      className={cn(
        'flex animate-rise-in flex-col gap-3 rounded-card border bg-pan p-4 text-tx transition-[background,border-color] duration-200 hover:border-bd2 hover:bg-pan4',
        isLive ? 'border-bd2' : 'border-bd',
      )}
      style={{ animationDelay: `${index * CARD_DELAY_STEP_MS}ms` }}
    >
      <div className="flex items-start gap-[10px]">
        <div className="flex min-w-0 flex-col gap-[5px]">
          <span className="text-[19.8px] leading-none font-bold tracking-[-.01em] text-pretty">{championship.name}</span>
          <span className="text-[10.5px] tracking-[.08em] text-tx4">{championship.statusLine}</span>
        </div>
        <CategoryTag category={championship.category} size="medium" className="self-start" />
      </div>
      <div className="flex flex-col gap-px bg-pan2 px-[10px] py-2">
        {championship.podium.length > 0 ? (
          championship.podium.map((row) => (
            <div key={row.position} className="flex min-w-0 items-center gap-[9px] py-1">
              <span className={cn('w-3 flex-none text-[11px]', row.position === 1 ? 'text-ac' : 'text-tx4')}>{row.position}</span>
              <Crest color={row.team.color} imagePath={row.team.crestPath} width={16} />
              <span className={cn('min-w-0 truncate text-[11.7px] font-bold tracking-[-.01em]', row.position === 1 ? 'text-tx' : 'text-tx2')}>
                {row.team.name}
              </span>
              <span className={cn('ml-auto flex-none text-[12.5px] nums', row.position === 1 ? 'font-semibold text-tx' : 'text-tx2')}>{row.points}</span>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-[9px] py-1">
            <span className="w-3 flex-none text-[9.9px] text-tx4">—</span>
            <span className="h-[19px] w-4 flex-none" />
            <span className="text-[10.8px] font-semibold tracking-[-.01em] text-tx4">Sem partidas com resultado</span>
          </div>
        )}
      </div>
      <div className={cn('flex min-w-0 items-center gap-2 rounded-card border px-[10px] py-2', isLive ? 'border-ac bg-pan2' : 'border-bd bg-transparent')}>
        {isLive ? <span className="size-[7px] flex-none animate-live-dot rounded-full bg-ac" /> : <Icon name="schedule" size={16} className="text-tx4" />}
        <span className={cn('min-w-0 truncate text-[11.3px] font-bold tracking-[-.01em]', isLive ? 'text-tx' : 'text-tx2')}>{status.text}</span>
        <span className={cn('ml-auto flex-none text-[11px]', isLive ? 'text-ac' : 'text-tx4')}>{status.meta}</span>
      </div>
      <span
        className={cn(
          'flex h-9 items-center justify-center rounded-card border border-bd2 text-[11.3px] font-bold tracking-[-.01em] transition-colors',
          isLive ? 'text-ac' : 'text-tx2',
        )}
      >
        {isLive ? 'Abrir transmissão' : 'Abrir campeonato'}
      </span>
    </Link>
  )
}
