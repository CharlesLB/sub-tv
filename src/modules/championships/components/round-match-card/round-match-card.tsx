import Link from 'next/link'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { formatShortDateTime } from '@/lib/utils/format-date/format-date'
import { Crest } from '@/components/ui/crest/crest'
import type { MatchCardVM, TeamBadgeVM } from '../../types'

const FINISHED_STATUS = 'encerrado'
const LIVE_STATUS = 'ao_vivo'

type Side = 'home' | 'away'

const winnerOf = (match: MatchCardVM): Side | null => {
  if (match.homeScore === null || match.awayScore === null || match.homeScore === match.awayScore) return null

  return match.homeScore > match.awayScore ? 'home' : 'away'
}

const describeKicker = (match: MatchCardVM): string => {
  if (match.status === LIVE_STATUS) return 'Ao vivo'
  if (match.status === FINISHED_STATUS) return `Encerrada · rodada ${match.round ?? '–'}`

  return match.kickoffAt ? formatShortDateTime(match.kickoffAt) : 'Data a definir'
}

type CardAction = { href: ReturnType<typeof routes.live> | ReturnType<typeof routes.newMatch>; label: string; isPrimary: boolean }

const actionOf = (match: MatchCardVM, seasonId: string): CardAction => {
  if (match.status === FINISHED_STATUS) return { href: routes.live(match.id), label: 'Ver partida', isPrimary: false }
  if (match.isBroadcast) return { href: routes.live(match.id), label: 'Abrir transmissão', isPrimary: true }

  return { href: routes.newMatch(seasonId, match.id), label: 'Narrar partida', isPrimary: false }
}

type TeamLineProps = { team: TeamBadgeVM; score: number | null; isDimmed: boolean }

function TeamLine({ team, score, isDimmed }: TeamLineProps) {
  return (
    <div className="flex min-w-0 items-center gap-[9px]">
      <Crest color={team.color} imagePath={team.crestPath} width={16} />
      <span className={cn('min-w-0 flex-1 truncate text-[12.6px] font-bold tracking-[-.01em]', isDimmed ? 'text-tx2' : 'text-tx')}>{team.name}</span>
      <span className={cn('flex-none font-mono text-[17px] font-semibold nums', score === null ? 'text-tx5' : isDimmed ? 'text-tx2' : 'text-tx')}>{score ?? '—'}</span>
    </div>
  )
}

type RoundMatchCardProps = { match: MatchCardVM; seasonId: string }

export function RoundMatchCard({ match, seasonId }: RoundMatchCardProps) {
  const isLive = match.status === LIVE_STATUS
  const winner = winnerOf(match)
  const action = actionOf(match, seasonId)

  return (
    <div className={cn('flex flex-col gap-[5px] border-l-2 bg-pan2 px-3 py-[11px]', isLive ? 'border-ac' : 'border-bd')}>
      <span className={cn('text-[10px] tracking-[.1em]', isLive ? 'text-ac' : 'text-tx4')}>{describeKicker(match)}</span>
      <TeamLine team={match.home} score={match.homeScore} isDimmed={winner === 'away'} />
      <TeamLine team={match.away} score={match.awayScore} isDimmed={winner === 'home'} />
      <Link
        href={action.href}
        className={cn(
          'mt-1 flex h-8 items-center justify-center text-[10.3px] font-bold tracking-[-.01em]',
          action.isPrimary ? 'bg-ac text-bg' : 'border border-bd2 bg-transparent text-tx2 hover:border-tx hover:text-tx',
        )}
      >
        {action.label}
      </Link>
    </div>
  )
}
