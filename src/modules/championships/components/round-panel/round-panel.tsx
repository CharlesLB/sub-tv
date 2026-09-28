import Link from 'next/link'
import { routes } from '@/lib/routes'
import { CHAMPIONSHIP_TAB } from '../../championship-tab'
import type { MatchCardVM } from '../../types'
import { RoundMatchCard } from '../round-match-card/round-match-card'

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
    <aside className="flex min-w-[280px] flex-[0_1_340px] flex-col gap-[10px] mobile:min-w-0">
      <div className="flex items-center gap-[10px]">
        <span className="text-[13.5px] font-bold tracking-[-.01em]">{currentRound ? `Rodada ${currentRound}` : 'Rodada'}</span>
        <span className="ml-auto text-[10.5px] text-tx4">
          {matches.length} {matches.length === 1 ? 'Partida' : 'Partidas'} No campeonato
        </span>
      </div>
      {roundMatches.map((match) => (
        <RoundMatchCard key={match.id} match={match} seasonId={seasonId} />
      ))}
      {roundMatches.length === 0 ? (
        <div className="flex flex-col items-center gap-[14px] rounded-card border border-bd bg-pan px-[18px] py-[26px] text-center">
          <span className="h-[34px] w-7 border border-bd2 bg-bd hexagon" />
          <span className="text-[13.5px] font-bold tracking-[-.01em]">Nenhuma partida nesta rodada</span>
          <span className="max-w-[260px] text-[12.5px] leading-normal text-tx3">A tabela só muda quando existem partidas com resultado nesta rodada.</span>
          <Link href={routes.newMatch(seasonId)} className="flex h-[38px] items-center bg-ac px-4 text-[10.8px] font-bold tracking-[-.01em] text-bg">
            Criar partida
          </Link>
        </div>
      ) : null}
      <Link
        href={routes.championship(seasonId, CHAMPIONSHIP_TAB.MATCHES)}
        className="flex h-9 items-center justify-center border border-dashed border-bd2 text-[10.3px] font-bold tracking-[-.01em] text-tx4 hover:border-tx hover:text-tx"
      >
        Ver todas as rodadas
      </Link>
    </aside>
  )
}
