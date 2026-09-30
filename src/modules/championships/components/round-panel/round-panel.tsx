import Link from 'next/link'
import { routes } from '@/lib/routes'
import { CHAMPIONSHIP_TAB } from '../../lib/championship-tab/championship-tab'
import type { MatchCardVM } from '../../types'
import { RoundMatchCard } from '../round-match-card/round-match-card'
import { roundPanelStyles as styles } from './round-panel.styles'

const MAXIMUM_ROUND_CARDS = 8

type RoundPanelProps = {
  seasonId: string
  matches: MatchCardVM[]
  currentRound: number | null
  currentPhase: string | null
}

export function RoundPanel({ seasonId, matches, currentRound, currentPhase }: RoundPanelProps) {
  const roundMatches = matches.filter((match) => match.round === currentRound && (currentPhase === null || match.phase === currentPhase)).slice(0, MAXIMUM_ROUND_CARDS)

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>{currentRound ? `Rodada ${currentRound}` : 'Rodada'}</span>
        <span className={styles.matchCount}>
          {matches.length} {matches.length === 1 ? 'Partida' : 'Partidas'} No campeonato
        </span>
      </div>
      {roundMatches.map((match) => (
        <RoundMatchCard key={match.id} match={match} seasonId={seasonId} />
      ))}
      {roundMatches.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyCrest} />
          <span className={styles.emptyTitle}>Nenhuma partida nesta rodada</span>
          <span className={styles.emptyDescription}>A tabela só muda quando existem partidas com resultado nesta rodada.</span>
          <Link href={routes.newMatch(seasonId)} className={styles.createMatchLink}>
            Criar partida
          </Link>
        </div>
      ) : null}
      <Link href={routes.championship(seasonId, CHAMPIONSHIP_TAB.MATCHES)} className={styles.allRoundsLink}>
        Ver todas as rodadas
      </Link>
    </aside>
  )
}
