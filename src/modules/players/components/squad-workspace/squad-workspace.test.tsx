import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PLAYER_PARAMETER, routes } from '@/lib/routes'
import { secondSquadPlayerFixture, squadPlayerFixture } from '../roster-row/roster-row.fixtures'
import { emptyTeamSquadFixture, teamSquadFixture } from '../squad-header/squad-header.fixtures'
import { SquadWorkspace } from './squad-workspace'

const navigation = vi.hoisted(() => ({ refresh: vi.fn(), searchParams: new URLSearchParams() }))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: navigation.refresh }),
  useSearchParams: () => navigation.searchParams,
}))

const withRequestedPlayer = (playerId: string | null) => {
  navigation.searchParams = new URLSearchParams(playerId ? { [PLAYER_PARAMETER]: playerId } : {})
}

const NO_LAST_CHANGE = { playerId: null, content: null }

describe('SquadWorkspace', () => {
  it('opens the sheet of the first player when no player is requested', () => {
    withRequestedPlayer(null)

    render(<SquadWorkspace squad={teamSquadFixture} categoryFilter={undefined} canEdit={false} lastChange={NO_LAST_CHANGE} />)

    const sheet = screen.getByRole('complementary', { name: 'Ficha do jogador' })
    expect(within(sheet).getByLabelText('Nome')).toHaveValue(squadPlayerFixture.fullName)
    expect(within(screen.getByRole('region', { name: 'Elenco' })).getAllByRole('link')).toHaveLength(3)
  })

  it('opens the sheet of the player requested in the address', () => {
    withRequestedPlayer(secondSquadPlayerFixture.id)

    render(<SquadWorkspace squad={teamSquadFixture} categoryFilter={undefined} canEdit={false} lastChange={NO_LAST_CHANGE} />)

    expect(within(screen.getByRole('complementary', { name: 'Ficha do jogador' })).getByLabelText('Nome')).toHaveValue(secondSquadPlayerFixture.fullName)
    expect(screen.getByRole('link', { current: true })).toHaveTextContent(secondSquadPlayerFixture.fullName)
  })

  it('shows the last change only in the sheet of the player it belongs to', () => {
    withRequestedPlayer(null)

    render(<SquadWorkspace squad={teamSquadFixture} categoryFilter={undefined} canEdit={false} lastChange={{ playerId: secondSquadPlayerFixture.id, content: <p>Última alteração: Marta</p> }} />)

    expect(screen.queryByText('Última alteração: Marta')).not.toBeInTheDocument()
  })

  it('renders the last change in the sheet of the matching player', () => {
    withRequestedPlayer(null)

    render(<SquadWorkspace squad={teamSquadFixture} categoryFilter={undefined} canEdit={false} lastChange={{ playerId: squadPlayerFixture.id, content: <p>Última alteração: Marta</p> }} />)

    expect(screen.getByText('Última alteração: Marta')).toBeInTheDocument()
  })

  it('shows the loading bar while the server data of the selected player has not arrived', () => {
    withRequestedPlayer(secondSquadPlayerFixture.id)

    render(<SquadWorkspace squad={teamSquadFixture} categoryFilter={undefined} canEdit={false} lastChange={{ playerId: squadPlayerFixture.id, content: null }} />)

    expect(screen.getByRole('progressbar', { name: 'Carregando página' })).toBeInTheDocument()
  })

  it('hides the loading bar once the server data belongs to the selected player', () => {
    withRequestedPlayer(secondSquadPlayerFixture.id)

    render(<SquadWorkspace squad={teamSquadFixture} categoryFilter={undefined} canEdit={false} lastChange={{ playerId: secondSquadPlayerFixture.id, content: null }} />)

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('filters the roster by the typed search', async () => {
    withRequestedPlayer(null)
    render(<SquadWorkspace squad={teamSquadFixture} categoryFilter={undefined} canEdit={false} lastChange={NO_LAST_CHANGE} />)

    await userEvent.type(screen.getByRole('searchbox'), 'caio')

    const roster = screen.getByRole('region', { name: 'Elenco' })
    expect(within(roster).getAllByRole('link')).toHaveLength(1)
    expect(within(roster).getByRole('link')).toHaveTextContent(secondSquadPlayerFixture.fullName)
  })

  it('pushes the player address and refreshes the router when a row is clicked', async () => {
    withRequestedPlayer(null)
    const pushState = vi.spyOn(window.history, 'pushState')
    render(<SquadWorkspace squad={teamSquadFixture} categoryFilter={undefined} canEdit={false} lastChange={NO_LAST_CHANGE} />)

    await userEvent.click(screen.getByText(secondSquadPlayerFixture.fullName))

    expect(pushState).toHaveBeenCalledWith(null, '', routes.squads({ year: 2025, teamKey: teamSquadFixture.key, playerId: secondSquadPlayerFixture.id }))
    expect(navigation.refresh).toHaveBeenCalledTimes(1)
    pushState.mockRestore()
  })

  it('pushes the squad address without a player when the sheet is closed', async () => {
    withRequestedPlayer(squadPlayerFixture.id)
    const pushState = vi.spyOn(window.history, 'pushState')
    render(<SquadWorkspace squad={teamSquadFixture} categoryFilter={undefined} canEdit={false} lastChange={NO_LAST_CHANGE} />)

    await userEvent.click(screen.getByRole('button', { name: 'Fechar ✕' }))

    expect(pushState).toHaveBeenCalledWith(null, '', routes.squads({ year: 2025, teamKey: teamSquadFixture.key }))
    pushState.mockRestore()
  })

  it('shows the empty sheet when the squad has no player', () => {
    withRequestedPlayer(null)

    render(<SquadWorkspace squad={emptyTeamSquadFixture} categoryFilter={undefined} canEdit={false} lastChange={NO_LAST_CHANGE} />)

    expect(screen.getAllByText('Nenhum atleta vinculado a este time ainda.')).toHaveLength(2)
    expect(screen.queryByRole('heading', { name: 'Ficha do jogador' })).not.toBeInTheDocument()
  })
})
