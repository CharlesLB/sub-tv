import { Crest } from '@/components/ui/crest/crest'
import { CategoryTag, categoryLabel } from '@/modules/championships/client'
import type { TeamSquadVM } from '../../types'
import { NewPlayerPopover } from '../new-player-popover/new-player-popover'
import { squadHeaderStyles as styles } from './squad-header.styles'

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
    <div className={styles.header}>
      <Crest color={squad.badge.color} imagePath={squad.badge.crestPath} width={22} />
      <div className={styles.identity}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>{squad.badge.name}</h2>
          <CategoryTag category={squad.category} size="extraLarge" className={styles.categoryTag} />
        </div>
        <p className={styles.summary}>
          Elenco {squad.badge.name} {category} · temporada {squad.year} · {squad.players.length} Atletas vinculados
        </p>
      </div>
      <input
        type="search"
        value={searchText}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="buscar nome ou número"
        aria-label="Buscar atleta por nome ou número"
        className={styles.search}
      />
      {canEdit ? <NewPlayerPopover squad={squad} onPlayerCreated={onPlayerCreated} /> : null}
    </div>
  )
}
