import type { Category } from '../../categories'
import { toPhaseLabel } from '../../mappers'
import type { StandingPhaseVM } from '../../types'
import { FormSquare } from '../form-square/form-square'
import { StandingsTable } from '../standings-table/standings-table'
import { standingsPanelStyles as styles } from './standings-panel.styles'

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
    <section className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>Classificação</span>
        {roundsPlayed ? (
          <span className={styles.roundsPlayed}>
            Após {roundsPlayed} {roundsPlayed === 1 ? 'Rodada' : 'Rodadas'}
          </span>
        ) : null}
        <span className={styles.hint}>Clique num time para ver o elenco.</span>
      </div>
      {phases.length === 0 ? <div className={styles.emptyState}>A classificação aparece quando houver partidas com resultado.</div> : null}
      {phases.map((phase, phaseIndex) => (
        <div key={phase.phase} className={styles.phase}>
          {phases.length > 1 ? <span className={phaseIndex === 0 ? styles.phaseTitle : styles.phaseTitleSpaced}>{phaseTitle(phase.phase)}</span> : null}
          {phase.groups.map((group) => (
            <StandingsTable key={group.groupName ?? 'unico'} group={group} category={category} />
          ))}
        </div>
      ))}
      <div className={styles.legend}>
        <span>PTS pontos · J jogos · V vitórias · E empates · D derrotas · SG saldo de gols</span>
        <span className={styles.legendResults}>
          {LEGEND.map((entry) => (
            <span key={entry.result} className={styles.legendEntry}>
              <FormSquare result={entry.result} size="small" />
              {entry.label}
            </span>
          ))}
        </span>
      </div>
    </section>
  )
}
