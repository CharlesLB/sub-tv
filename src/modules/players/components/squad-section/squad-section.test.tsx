import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { PLAYER_PARAMETER } from '@/lib/routes'
import { AUDIT_ENTITY } from '@/modules/audit'
import { getLastChange } from '@/modules/audit/data/get-last-change'
import { CATEGORY } from '@/modules/championships/client'
import { seasonTeamFixture } from '@/modules/teams/components/team-list-item/team-list-item.fixtures'
import { getTeamSquad } from '../../data/get-team-squad'
import { secondSquadPlayerFixture, squadPlayerFixture } from '../roster-row/roster-row.fixtures'
import { teamSquadFixture } from '../squad-header/squad-header.fixtures'
import { SquadSection } from './squad-section'

const navigation = vi.hoisted(() => ({ searchParams: new URLSearchParams() }))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
  useSearchParams: () => navigation.searchParams,
}))

const renderSection = async (requestedPlayerId: string | undefined) => {
  navigation.searchParams = new URLSearchParams(requestedPlayerId ? { [PLAYER_PARAMETER]: requestedPlayerId } : {})

  return render(<Suspense>{await SquadSection({ year: 2025, team: seasonTeamFixture, categoryFilter: undefined, canEdit: false, requestedPlayerId })}</Suspense>)
}

describe('SquadSection', () => {
  it('shows the empty state naming the team when it has no squad in the season', async () => {
    vi.mocked(getTeamSquad).mockResolvedValue(null)

    await renderSection(undefined)

    expect(screen.getByRole('heading', { name: 'Estrela do Vale SUB-14 sem elenco' })).toBeInTheDocument()
    expect(screen.getByText('Nenhum atleta vinculado em 2025 ainda.')).toBeInTheDocument()
  })

  it('asks for the squad of the team in the season and shows the workspace', async () => {
    vi.mocked(getTeamSquad).mockResolvedValue(teamSquadFixture)

    await renderSection(undefined)

    expect(getTeamSquad).toHaveBeenCalledWith(2025, CATEGORY.SUB14, seasonTeamFixture.clubId)
    expect(screen.getByRole('region', { name: 'Elenco' })).toBeInTheDocument()
  })

  it('loads the last change of the requested player', async () => {
    vi.mocked(getTeamSquad).mockResolvedValue(teamSquadFixture)

    await renderSection(secondSquadPlayerFixture.id)

    expect(await screen.findByRole('complementary', { name: 'Ficha do jogador' })).toBeInTheDocument()
    expect(getLastChange).toHaveBeenCalledWith(AUDIT_ENTITY.PLAYER, secondSquadPlayerFixture.id)
  })

  it('loads the last change of the first player when the requested player is not in the squad', async () => {
    vi.mocked(getTeamSquad).mockResolvedValue(teamSquadFixture)

    await renderSection('jogador-de-outro-time')

    expect(await screen.findByRole('complementary', { name: 'Ficha do jogador' })).toBeInTheDocument()
    expect(getLastChange).toHaveBeenCalledWith(AUDIT_ENTITY.PLAYER, squadPlayerFixture.id)
  })
})
