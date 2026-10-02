import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { formatTime, formatTitleDate } from '@/lib/utils/format-date/format-date'
import { Crest } from '@/components/ui/crest/crest'
import { LinkPendingIndicator } from '@/components/ui/link-pending-indicator/link-pending-indicator'
import type { Category } from '../../lib/categories/categories'
import { MATCH_CARD_ACTION, MATCH_SIDE, type MatchCardActionKind, type MatchSide, matchCardActionOf, winnerOf } from '../../lib/match-card-action/match-card-action'
import { MATCH_STATUS, type MatchStatus } from '../../lib/match-status/match-status'
import type { MatchCardVM, TeamBadgeVM } from '../../types'
import { CategoryTag } from '../category-tag/category-tag'
import { matchCardStyles as styles } from './match-card.styles'

const STATUS_LABEL: Record<MatchStatus, string> = {
  [MATCH_STATUS.SCHEDULED]: 'AGENDADA',
  [MATCH_STATUS.LIVE]: 'AO VIVO',
  [MATCH_STATUS.FINISHED]: 'ENCERRADA',
  [MATCH_STATUS.POSTPONED]: 'ADIADA',
  [MATCH_STATUS.CANCELLED]: 'CANCELADA',
  [MATCH_STATUS.WALKOVER]: 'W.O.',
}

const ACTION_LABEL: Record<MatchCardActionKind, string> = {
  [MATCH_CARD_ACTION.VIEW]: 'Ver partida',
  [MATCH_CARD_ACTION.ENTER_BROADCAST]: 'Entrar',
  [MATCH_CARD_ACTION.NARRATE]: 'Narrar',
}

const describeClock = (match: MatchCardVM): string => {
  if (match.status === MATCH_STATUS.FINISHED) return match.homePenalties === null ? 'FINAL' : `PÊNALTIS ${match.homePenalties}–${match.awayPenalties ?? 0}`
  if (match.status === MATCH_STATUS.LIVE) return 'EM ANDAMENTO'

  return match.kickoffAt ? formatTime(match.kickoffAt) : '--:--'
}

const scoreToneOf = (side: MatchSide, winner: MatchSide | null, hasScore: boolean): string => {
  if (!hasScore) return styles.scoreEmpty
  if (winner && winner !== side) return styles.scoreLoser

  return styles.scoreWinner
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
  const isLive = match.status === MATCH_STATUS.LIVE
  const action = matchCardActionOf(match, seasonId)
  const hasScore = match.homeScore !== null && match.awayScore !== null
  const winner = winnerOf(match)
  const scoreClass = (side: MatchSide) => cn(styles.score, scoreToneOf(side, winner, hasScore))
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
            <span className={scoreClass(MATCH_SIDE.HOME)}>{match.homeScore ?? '–'}</span>
            <span className={styles.scoreSeparator}>×</span>
            <span className={scoreClass(MATCH_SIDE.AWAY)}>{match.awayScore ?? '–'}</span>
          </div>
          <span className={cn(styles.clock, isLive ? styles.clockLive : styles.clockIdle)}>{describeClock(match)}</span>
        </div>
        <TeamColumn team={match.away} />
      </div>
      <div className={styles.footer}>
        <span className={styles.venue}>{[match.venue, match.city].filter(Boolean).join(' · ') || 'Local a definir'}</span>
        <Link href={action.href} className={cn(styles.action, action.isPrimary ? styles.actionPrimary : styles.actionSecondary)}>
          {ACTION_LABEL[action.kind]}
          <LinkPendingIndicator />
        </Link>
      </div>
    </article>
  )
}
