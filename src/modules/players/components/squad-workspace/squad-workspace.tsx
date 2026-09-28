'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { type ReactNode, useState } from 'react'
import { PLAYER_PARAMETER, routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import type { Category } from '@/modules/championships/client'
import { EMPTY_SQUAD_MESSAGE } from '../../labels'
import { matchesSquadSearch } from '../../squad-roster/squad-roster'
import type { TeamSquadVM } from '../../types'
import { PlayerSheet } from '../player-sheet/player-sheet'
import { RosterTable } from '../roster-table/roster-table'
import { SquadHeader } from '../squad-header/squad-header'
import { squadWorkspaceStyles as styles } from './squad-workspace.styles'

type SquadWorkspaceProps = {
  squad: TeamSquadVM
  categoryFilter: Category | undefined
  canEdit: boolean
  lastChange: { playerId: string | null; content: ReactNode }
}

export function SquadWorkspace({ squad, categoryFilter, canEdit, lastChange }: SquadWorkspaceProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchText, setSearchText] = useState('')
  const requestedPlayerId = searchParams.get(PLAYER_PARAMETER)
  const explicitPlayer = squad.players.find((player) => player.id === requestedPlayerId) ?? null
  const selectedPlayer = explicitPlayer ?? squad.players[0] ?? null
  const visiblePlayers = squad.players.filter((player) => matchesSquadSearch(player, searchText))
  const hrefFor = (playerId?: string) => routes.squads({ year: squad.year, category: categoryFilter, teamKey: squad.key, playerId })

  const showPlayer = (playerId?: string) => {
    window.history.pushState(null, '', hrefFor(playerId))
    router.refresh()
  }

  return (
    <>
      <section aria-label="Elenco" className={styles.roster}>
        <SquadHeader squad={squad} searchText={searchText} canEdit={canEdit} onSearchChange={setSearchText} onPlayerCreated={showPlayer} />
        <RosterTable players={visiblePlayers} teamColor={squad.badge.color} selectedPlayerId={selectedPlayer?.id ?? null} searchText={searchText} hrefFor={hrefFor} onSelect={showPlayer} />
      </section>
      <aside aria-label="Ficha do jogador" className={cn(styles.sheetPanel, styles.sheetPanelMobile, explicitPlayer ? null : styles.sheetPanelHiddenOnMobile)}>
        {selectedPlayer ? (
          <PlayerSheet
            key={selectedPlayer.id}
            player={selectedPlayer}
            squad={squad}
            categoryFilter={categoryFilter}
            canEdit={canEdit}
            lastChange={lastChange.playerId === selectedPlayer.id ? lastChange.content : null}
            onClose={() => showPlayer()}
          />
        ) : (
          <div className={styles.emptySheet}>
            <span className={styles.emptySheetTitle}>Ficha do jogador</span>
            <p className={styles.emptySheetMessage}>{EMPTY_SQUAD_MESSAGE}</p>
          </div>
        )}
      </aside>
    </>
  )
}
