import type { CompetitionPresence } from '../../competition-presences/competition-presences'
import { pluralize } from '../../stat-format/stat-format'
import { HistoryEmptyState } from '../history-empty-state/history-empty-state'
import { HistorySection } from '../history-section/history-section'

type CompetitionPresenceListProps = { presences: CompetitionPresence[]; color: string }

export function CompetitionPresenceList({ presences, color }: CompetitionPresenceListProps) {
  return (
    <HistorySection title="Presenças por campeonato">
      {presences.length === 0 ? (
        <HistoryEmptyState message="Nenhuma participação nos filtros selecionados" />
      ) : (
        <div className="flex flex-col gap-[7px]">
          {presences.map((presence) => (
            <div key={presence.name} className="flex min-w-0 items-center justify-between gap-[10px] rounded-card border border-bd bg-pan px-3 py-[10px]">
              <span className="truncate text-[11.7px] font-bold tracking-[-.01em] text-tx1">{presence.name}</span>
              <span className="flex-none text-[10px] tracking-[.06em]" style={{ color }}>
                {pluralize(presence.seasonCount, 'Temporada', 'Temporadas')}
              </span>
            </div>
          ))}
        </div>
      )}
    </HistorySection>
  )
}
