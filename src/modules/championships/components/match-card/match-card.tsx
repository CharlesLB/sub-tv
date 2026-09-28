import Link from 'next/link'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { formatTime, formatTitleDate } from '@/lib/utils/format-date/format-date'
import { Crest } from '@/components/ui/crest/crest'
import type { Category } from '../../categories'
import type { MatchCardVM, MatchStatus, TeamBadgeVM } from '../../types'
import { CategoryTag } from '../category-tag/category-tag'
import { matchCardStyles as styles } from './match-card.styles'

const STATUS_LABEL: Record<MatchStatus, string> = {
  agendado: 'AGENDADA',
  ao_vivo: 'AO VIVO',
  encerrado: 'ENCERRADA',
  adiado: 'ADIADA',
  cancelado: 'CANCELADA',
  wo: 'W.O.',
}

const describeClock = (match: MatchCardVM): string => {
  if (match.status === 'encerrado') return match.homePenalties === null ? 'FINAL' : `PÊNALTIS ${match.homePenalties}–${match.awayPenalties ?? 0}`
  if (match.status === 'ao_vivo') return 'EM ANDAMENTO'

  return match.kickoffAt ? formatTime(match.kickoffAt) : '--:--'
}

type CardAction = { href: ReturnType<typeof routes.live> | ReturnType<typeof routes.newMatch>; label: string; isPrimary: boolean }

const actionOf = (match: MatchCardVM, seasonId: string): CardAction => {
  if (match.status === 'encerrado') return { href: routes.live(match.id), label: 'Ver partida', isPrimary: false }
  if (match.isBroadcast) return { href: routes.live(match.id), label: 'Entrar', isPrimary: true }

  return { href: routes.newMatch(seasonId, match.id), label: 'Narrar', isPrimary: false }
}

type TeamColumnProps = { team: TeamBadgeVM }

function TeamColumn({ team }: TeamColumnProps) {
  return (
    <div className={styles.teamColumn}>
      <Crest color={team.color} imagePath={team.crestPath} width={30} />
      <span className={styles.teamName}>{team.name}</span>
    </div>
  )
}

type MatchCardProps = { match: MatchCardVM; seasonId: string; category: Category }

export function MatchCard({ match, seasonId, category }: MatchCardProps) {
  const isLive = match.status === 'ao_vivo'
  const action = actionOf(match, seasonId)
  const hasScore = match.homeScore !== null && match.awayScore !== null
  const winner = hasScore && match.homeScore !== match.awayScore ? ((match.homeScore ?? 0) > (match.awayScore ?? 0) ? 'home' : 'away') : null
  const scoreClass = (side: 'home' | 'away') => cn(styles.score, !hasScore ? styles.scoreEmpty : winner && winner !== side ? styles.scoreLoser : styles.scoreWinner)
  const when = match.kickoffAt ? `${formatTitleDate(match.kickoffAt)} ${formatTime(match.kickoffAt)}` : 'Data a definir'

  return (
    <article className={cn(styles.card, isLive ? styles.cardLive : styles.cardIdle)}>
      <div className={styles.header}>
        {isLive ? <span className={styles.liveDot} /> : null}
        <span className={cn(styles.status, styles.statusTone[match.status])}>{STATUS_LABEL[match.status]}</span>
        <span className={styles.schedule}>
          R{match.round ?? '–'} · {when}
        </span>
        <CategoryTag category={category} size="medium" />
      </div>
      <div className={styles.scoreboard}>
        <TeamColumn team={match.home} />
        <div className={styles.scoreColumn}>
          <div className={styles.scoreLine}>
            <span className={scoreClass('home')}>{match.homeScore ?? '–'}</span>
            <span className={styles.scoreSeparator}>×</span>
            <span className={scoreClass('away')}>{match.awayScore ?? '–'}</span>
          </div>
          <span className={cn(styles.clock, isLive ? styles.clockLive : styles.clockIdle)}>{describeClock(match)}</span>
        </div>
        <TeamColumn team={match.away} />
      </div>
      <div className={styles.footer}>
        <span className={styles.venue}>{[match.venue, match.city].filter(Boolean).join(' · ') || 'Local a definir'}</span>
        <Link href={action.href} className={cn(styles.action, action.isPrimary ? styles.actionPrimary : styles.actionSecondary)}>
          {action.label}
        </Link>
      </div>
    </article>
  )
}
