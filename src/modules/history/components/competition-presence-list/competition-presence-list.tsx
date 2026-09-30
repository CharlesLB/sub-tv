import { pluralize } from '@/lib/utils/pluralize/pluralize'
import type { CompetitionPresence } from '../../lib/competition-presences/competition-presences'
import { HistoryEmptyState } from '../history-empty-state/history-empty-state'
import { HistorySection } from '../history-section/history-section'
import { competitionPresenceListStyles as styles } from './competition-presence-list.styles'

type CompetitionPresenceListProps = { presences: CompetitionPresence[]; color: string }

export function CompetitionPresenceList({ presences, color }: CompetitionPresenceListProps) {
  return (
    <HistorySection title="Presenças por campeonato">
      {presences.length === 0 ? (
        <HistoryEmptyState message="Nenhuma participação nos filtros selecionados" />
      ) : (
        <div className={styles.list}>
          {presences.map((presence) => (
            <div key={presence.name} className={styles.item}>
              <span className={styles.name}>{presence.name}</span>
              <span className={styles.seasonCount} style={{ color }}>
                {pluralize(presence.seasonCount, 'Temporada', 'Temporadas')}
              </span>
            </div>
          ))}
        </div>
      )}
    </HistorySection>
  )
}
