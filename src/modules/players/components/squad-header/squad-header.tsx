import { Crest } from '@/components/ui/crest/crest'
import { CategoryTag, categoryLabel } from '@/modules/championships/client'
import type { TeamSquadVM } from '../../types'
import { NewPlayerPopover } from '../new-player-popover/new-player-popover'

type SquadHeaderProps = {
  squad: TeamSquadVM
  searchText: string
  onSearchChange: (text: string) => void
  canEdit: boolean
  onPlayerCreated: (playerId: string) => void
}

export function SquadHeader({ squad, searchText, canEdit, onSearchChange, onPlayerCreated }: SquadHeaderProps) {
  const category = categoryLabel[squad.category]

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-bd px-4 py-3 mobile:gap-2 mobile:px-3 mobile:py-[10px]">
      <Crest color={squad.badge.color} width={22} />
      <div className="min-w-0 mobile:flex-[1_1_calc(100%_-_30px)]">
        <div className="flex flex-wrap items-center gap-[10px]">
          <h2 className="text-[16.2px] font-bold tracking-[-.01em]">{squad.badge.name}</h2>
          <CategoryTag category={squad.category} size="extraLarge" className="text-[12.5px]" />
        </div>
        <p className="mt-1 text-[11.5px] text-tx4">
          Elenco {squad.badge.name} {category} · temporada {squad.year} · {squad.players.length} Atletas vinculados
        </p>
      </div>
      <input
        type="search"
        value={searchText}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="buscar nome ou número"
        aria-label="Buscar atleta por nome ou número"
        className="h-[38px] min-w-[150px] flex-1 rounded-card border border-bd2 bg-bg px-3 text-[12.5px] text-tx outline-none placeholder:text-tx4 focus-visible:border-tx3 mobile:min-w-[90px]"
      />
      {canEdit ? <NewPlayerPopover squad={squad} onPlayerCreated={onPlayerCreated} /> : null}
    </div>
  )
}
