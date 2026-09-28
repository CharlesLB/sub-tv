import Link from 'next/link'
import { Crest } from '@/components/ui/crest/crest'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { formatTime, formatTitleDate } from '@/lib/utils/format-date/format-date'
import type { Category } from '../../categories'
import type { MatchCardVM, MatchStatus, TeamBadgeVM } from '../../types'
import { CategoryTag } from '../category-tag/category-tag'

const STATUS_LABEL: Record<MatchStatus, string> = {
  agendado: 'AGENDADA',
  ao_vivo: 'AO VIVO',
  encerrado: 'ENCERRADA',
  adiado: 'ADIADA',
  cancelado: 'CANCELADA',
  wo: 'W.O.',
}

const STATUS_CLASS: Record<MatchStatus, string> = {
  agendado: 'text-am',
  ao_vivo: 'text-ac',
  encerrado: 'text-tx4',
  adiado: 'text-am',
  cancelado: 'text-vm',
  wo: 'text-tx4',
}

const describeClock = (match: MatchCardVM): string => {
  if (match.status === 'encerrado') return match.homePenalties === null ? 'FINAL' : `PÊNALTIS ${match.homePenalties}–${match.awayPenalties ?? 0}`
  if (match.status === 'ao_vivo') return 'EM ANDAMENTO'

  return match.kickoffAt ? formatTime(match.kickoffAt) : '--:--'
}

type TeamColumnProps = { team: TeamBadgeVM }

function TeamColumn({ team }: TeamColumnProps) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2">
      <Crest color={team.color} width={30} />
      <span className="text-center text-[12.2px] font-bold tracking-[-.01em] text-balance">{team.name}</span>
    </div>
  )
}

type MatchCardProps = { match: MatchCardVM; seasonId: string; category: Category }

export function MatchCard({ match, seasonId, category }: MatchCardProps) {
  const isLive = match.status === 'ao_vivo'
  const isFinished = match.status === 'encerrado'
  const hasScore = match.homeScore !== null && match.awayScore !== null
  const winner = hasScore && match.homeScore !== match.awayScore ? ((match.homeScore ?? 0) > (match.awayScore ?? 0) ? 'home' : 'away') : null
  const scoreClass = (side: 'home' | 'away') => cn('text-[41.4px] leading-[.85] font-bold nums', !hasScore ? 'text-bd3' : winner && winner !== side ? 'text-tx2' : 'text-tx')
  const when = match.kickoffAt ? `${formatTitleDate(match.kickoffAt)} ${formatTime(match.kickoffAt)}` : 'Data a definir'

  return (
    <article className={cn('flex flex-col rounded-card border bg-pan', isLive ? 'border-bd2' : 'border-bd')}>
      <div className="flex items-center gap-2 border-b border-bd px-[13px] py-[9px]">
        {isLive ? <span className="size-[7px] flex-none animate-live-dot rounded-full bg-ac" /> : null}
        <span className={cn('text-[9px] font-bold tracking-[-.01em] whitespace-nowrap', STATUS_CLASS[match.status])}>{STATUS_LABEL[match.status]}</span>
        <span className="ml-auto text-[11px] whitespace-nowrap text-tx4">
          R{match.round ?? '–'} · {when}
        </span>
        <CategoryTag category={category} size="medium" />
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-[14px] py-5">
        <TeamColumn team={match.home} />
        <div className="flex flex-col items-center gap-[5px]">
          <div className="flex items-baseline gap-[11px]">
            <span className={scoreClass('home')}>{match.homeScore ?? '–'}</span>
            <span className="text-[21.6px] font-semibold text-bd2">×</span>
            <span className={scoreClass('away')}>{match.awayScore ?? '–'}</span>
          </div>
          <span className={cn('text-[11.5px] font-semibold tracking-[.06em]', isLive ? 'text-ac' : 'text-tx4')}>{describeClock(match)}</span>
        </div>
        <TeamColumn team={match.away} />
      </div>
      <div className="flex items-center gap-[10px] border-t border-bd px-[13px] py-[10px]">
        <span className="min-w-0 truncate text-[10.5px] whitespace-nowrap text-tx3">{[match.venue, match.city].filter(Boolean).join(' · ') || 'Local a definir'}</span>
        {isFinished ? null : (
          <Link
            href={match.isBroadcast ? routes.live(match.id) : routes.newMatch(seasonId, match.id)}
            className={cn(
              'ml-auto flex h-[30px] flex-none items-center px-[13px] text-[10.3px] font-bold tracking-[-.01em]',
              match.isBroadcast ? 'bg-ac text-bg' : 'border border-bd2 bg-transparent text-tx hover:border-tx',
            )}
          >
            {match.isBroadcast ? 'Entrar' : 'Narrar'}
          </Link>
        )}
      </div>
    </article>
  )
}
