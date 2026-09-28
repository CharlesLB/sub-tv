import Link from 'next/link'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { formatShortDateTime } from '@/lib/utils/format-date/format-date'
import { Crest } from '@/components/ui/crest/crest'
import type { MatchCardVM, TeamBadgeVM } from '../../types'
import { roundMatchCardStyles as styles } from './round-match-card.styles'

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
    <div className={styles.teamLine}>
      <Crest color={team.color} imagePath={team.crestPath} width={16} />
      <span className={cn(styles.teamName, isDimmed ? styles.teamDimmed : styles.teamHighlighted)}>{team.name}</span>
      <span className={cn(styles.score, score === null ? styles.scoreEmpty : isDimmed ? styles.teamDimmed : styles.teamHighlighted)}>{score ?? '—'}</span>
    </div>
  )
}

type RoundMatchCardProps = { match: MatchCardVM; seasonId: string }

export function RoundMatchCard({ match, seasonId }: RoundMatchCardProps) {
  const isLive = match.status === LIVE_STATUS
  const winner = winnerOf(match)
  const action = actionOf(match, seasonId)

  return (
    <div className={cn(styles.card, isLive ? styles.cardLive : styles.cardIdle)}>
      <span className={cn(styles.kicker, isLive ? styles.kickerLive : styles.kickerIdle)}>{describeKicker(match)}</span>
      <TeamLine team={match.home} score={match.homeScore} isDimmed={winner === 'away'} />
      <TeamLine team={match.away} score={match.awayScore} isDimmed={winner === 'home'} />
      <Link href={action.href} className={cn(styles.action, action.isPrimary ? styles.actionPrimary : styles.actionSecondary)}>
        {action.label}
      </Link>
    </div>
  )
}
