import Link from 'next/link'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { formatShortDateTime } from '@/lib/utils/format-date/format-date'
import { Crest } from '@/components/ui/crest/crest'
import { Icon } from '@/components/ui/icon/icon'
import type { ChampionshipCardVM } from '../../types'
import { CategoryTag } from '../category-tag/category-tag'
import { championshipCardStyles as styles } from './championship-card.styles'

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
    <Link href={href} className={cn(styles.card, isLive ? styles.cardLive : styles.cardIdle)} style={{ animationDelay: `${index * CARD_DELAY_STEP_MS}ms` }}>
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <span className={styles.name}>{championship.name}</span>
          <span className={styles.statusLine}>{championship.statusLine}</span>
        </div>
        <CategoryTag category={championship.category} size="medium" className={styles.categoryTag} />
      </div>
      <div className={styles.podium}>
        {championship.podium.length > 0 ? (
          championship.podium.map((row) => (
            <div key={row.position} className={styles.podiumRow}>
              <span className={cn(styles.podiumPosition, row.position === 1 ? styles.podiumPositionLeader : styles.podiumPositionOther)}>{row.position}</span>
              <Crest color={row.team.color} imagePath={row.team.crestPath} width={16} />
              <span className={cn(styles.podiumTeam, row.position === 1 ? styles.podiumTeamLeader : styles.podiumTeamOther)}>{row.team.name}</span>
              <span className={cn(styles.podiumPoints, row.position === 1 ? styles.podiumPointsLeader : styles.podiumPointsOther)}>{row.points}</span>
            </div>
          ))
        ) : (
          <div className={styles.emptyPodiumRow}>
            <span className={styles.emptyPodiumPosition}>—</span>
            <span className={styles.emptyPodiumCrest} />
            <span className={styles.emptyPodiumMessage}>Sem partidas com resultado</span>
          </div>
        )}
      </div>
      <div className={cn(styles.status, isLive ? styles.statusLive : styles.statusIdle)}>
        {isLive ? <span className={styles.liveDot} /> : <Icon name="schedule" size={16} className={styles.scheduleIcon} />}
        <span className={cn(styles.statusText, isLive ? styles.statusTextLive : styles.statusTextIdle)}>{status.text}</span>
        <span className={cn(styles.statusMeta, isLive ? styles.statusMetaLive : styles.statusMetaIdle)}>{status.meta}</span>
      </div>
      <span className={cn(styles.openLabel, isLive ? styles.openLabelLive : styles.openLabelIdle)}>{isLive ? 'Abrir transmissão' : 'Abrir campeonato'}</span>
    </Link>
  )
}
