import { toPhaseLabel } from '../../mappers'
import type { Category } from '../../categories'
import type { StandingPhaseVM } from '../../types'
import { FormSquare } from '../form-squares/form-squares'
import { StandingsTable } from '../standings-table/standings-table'

const JOINT_PHASE_PREFIX = 'CONJUNTA'
const LEGEND = [
  { result: 'V', label: 'Vitória' },
  { result: 'E', label: 'Empate' },
  { result: 'D', label: 'Derrota' },
] as const

const phaseTitle = (phase: string): string => (phase.startsWith(JOINT_PHASE_PREFIX) ? 'Classificação conjunta Sub-13 + Sub-14' : `Classificação · ${toPhaseLabel(phase)}`)

type StandingsPanelProps = { phases: StandingPhaseVM[]; category: Category; roundsPlayed: number | null }

export function StandingsPanel({ phases, category, roundsPlayed }: StandingsPanelProps) {
  return (
    <section className="flex min-w-0 flex-[1_1_560px] flex-col gap-[10px]">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[13.5px] font-bold tracking-[-.01em]">Classificação</span>
        {roundsPlayed ? <span className="text-[10.5px] text-tx4">Após {roundsPlayed} {roundsPlayed === 1 ? 'Rodada' : 'Rodadas'}</span> : null}
        <span className="text-[12.5px] text-tx4">Clique num time para ver o elenco.</span>
      </div>
      {phases.length === 0 ? (
        <div className="rounded-card border border-bd bg-pan px-4 py-6 text-center text-[12.5px] text-tx4">A classificação aparece quando houver partidas com resultado.</div>
      ) : null}
      {phases.map((phase, phaseIndex) => (
        <div key={phase.phase} className="flex flex-col gap-2">
          {phases.length > 1 ? <span className={phaseIndex === 0 ? 'text-[11.3px] font-bold text-tx2' : 'mt-3 text-[11.3px] font-bold text-tx2'}>{phaseTitle(phase.phase)}</span> : null}
          {phase.groups.map((group) => (
            <StandingsTable key={group.groupName ?? 'unico'} group={group} category={category} />
          ))}
        </div>
      ))}
      <div className="flex flex-wrap gap-[18px] text-[12px] text-tx4">
        <span>PTS pontos · J jogos · V vitórias · E empates · D derrotas · SG saldo de gols</span>
        <span className="flex items-center gap-[10px]">
          {LEGEND.map((entry) => (
            <span key={entry.result} className="flex items-center gap-[5px]">
              <FormSquare result={entry.result} size="small" />
              {entry.label}
            </span>
          ))}
        </span>
      </div>
    </section>
  )
}
