'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, type ReactNode } from 'react'
import { PLAYER_PARAMETER, routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import type { Category } from '@/modules/championships/client'
import { matchesSquadSearch } from '../../squad-roster/squad-roster'
import type { TeamSquadVM } from '../../types'
import { PlayerSheet } from '../player-sheet/player-sheet'
import { RosterTable } from '../roster-table/roster-table'
import { SquadHeader } from '../squad-header/squad-header'

type SquadWorkspaceProps = {
  squad: TeamSquadVM
  categoryFilter: Category | undefined
  canEdit: boolean
  lastChange: { playerId: string | null; content: ReactNode }
}

export function SquadWorkspace({
  squad,
  categoryFilter,
  canEdit,
  lastChange,
}: SquadWorkspaceProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchText, setSearchText] = useState('')
  const requestedPlayerId = searchParams.get(PLAYER_PARAMETER)
  const explicitPlayer = squad.players.find((player) => player.id === requestedPlayerId) ?? null
  const selectedPlayer = explicitPlayer ?? squad.players[0] ?? null
  const visiblePlayers = squad.players.filter((player) => matchesSquadSearch(player, searchText))
  const hrefFor = (playerId?: string) =>
    routes.squads({ year: squad.year, category: categoryFilter, teamKey: squad.key, playerId })
  const showPlayer = (playerId?: string) => {
    window.history.pushState(null, '', hrefFor(playerId))
    router.refresh()
  }

  return (
    <>
      <section
        aria-label="Elenco"
        className="bg-pan2 mobile:min-h-0 mobile:flex-1 @container flex max-h-full min-h-[300px] min-w-0 flex-[4_1_300px] flex-col"
      >
        <SquadHeader
          squad={squad}
          searchText={searchText}
          canEdit={canEdit}
          onSearchChange={setSearchText}
          onPlayerCreated={showPlayer}
        />
        <RosterTable
          players={visiblePlayers}
          teamColor={squad.badge.color}
          selectedPlayerId={selectedPlayer?.id ?? null}
          searchText={searchText}
          hrefFor={hrefFor}
          onSelect={showPlayer}
        />
      </section>
      <aside
        aria-label="Ficha do jogador"
        className={cn(
          'bg-pan max-h-full min-h-[260px] max-w-[420px] min-w-0 flex-[2_1_280px] self-stretch overflow-y-auto',
          'mobile:absolute mobile:inset-x-0 mobile:bottom-0 mobile:z-40 mobile:max-h-[76%] mobile:max-w-none mobile:min-h-0 mobile:animate-fade-up mobile:border-t mobile:border-bd2',
          explicitPlayer ? null : 'mobile:hidden',
        )}
      >
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
          <div className="flex flex-col gap-2 px-5 py-[18px]">
            <span className="text-[14.4px] font-bold tracking-[-.01em]">Ficha do jogador</span>
            <p className="text-tx4 text-[12.5px] leading-[1.5]">
              Nenhum atleta vinculado a este time ainda.
            </p>
          </div>
        )}
      </aside>
    </>
  )
}
