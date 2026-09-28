import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { formatShortDateTime } from '@/lib/utils/format-date/format-date'
import { Crest } from '@/components/ui/crest/crest'
import { MATCH_CARD_ACTION, MATCH_SIDE, type MatchCardActionKind, matchCardActionOf, winnerOf } from '../../match-card-action/match-card-action'
import { MATCH_STATUS } from '../../match-status/match-status'
import type { MatchCardVM, TeamBadgeVM } from '../../types'
import { roundMatchCardStyles as styles } from './round-match-card.styles'

const ACTION_LABEL: Record<MatchCardActionKind, string> = {
  [MATCH_CARD_ACTION.VIEW]: 'Ver partida',
  [MATCH_CARD_ACTION.ENTER_BROADCAST]: 'Abrir transmissão',
  [MATCH_CARD_ACTION.NARRATE]: 'Narrar partida',
}

const describeKicker = (match: MatchCardVM): string => {
  if (match.status === MATCH_STATUS.LIVE) return 'Ao vivo'
  if (match.status === MATCH_STATUS.FINISHED) return `Encerrada · rodada ${match.round ?? '–'}`

  return match.kickoffAt ? formatShortDateTime(match.kickoffAt) : 'Data a definir'
}

const scoreToneOf = (score: number | null, isDimmed: boolean): string => {
  if (score === null) return styles.scoreEmpty

  return isDimmed ? styles.teamDimmed : styles.teamHighlighted
}

type TeamLineProps = { team: TeamBadgeVM; score: number | null; isDimmed: boolean }

function TeamLine({ team, score, isDimmed }: TeamLineProps) {
  return (
    <div className={styles.teamLine}>
      <Crest color={team.color} imagePath={team.crestPath} width={16} />
      <span className={cn(styles.teamName, isDimmed ? styles.teamDimmed : styles.teamHighlighted)}>{team.name}</span>
      <span className={cn(styles.score, scoreToneOf(score, isDimmed))}>{score ?? '—'}</span>
    </div>
  )
}

type RoundMatchCardProps = { match: MatchCardVM; seasonId: string }

export function RoundMatchCard({ match, seasonId }: RoundMatchCardProps) {
  const isLive = match.status === MATCH_STATUS.LIVE
  const winner = winnerOf(match)
  const action = matchCardActionOf(match, seasonId)

  return (
    <div className={cn(styles.card, isLive ? styles.cardLive : styles.cardIdle)}>
      <span className={cn(styles.kicker, isLive ? styles.kickerLive : styles.kickerIdle)}>{describeKicker(match)}</span>
      <TeamLine team={match.home} score={match.homeScore} isDimmed={winner === MATCH_SIDE.AWAY} />
      <TeamLine team={match.away} score={match.awayScore} isDimmed={winner === MATCH_SIDE.HOME} />
      <Link href={action.href} className={cn(styles.action, action.isPrimary ? styles.actionPrimary : styles.actionSecondary)}>
        {ACTION_LABEL[action.kind]}
      </Link>
    </div>
  )
}
