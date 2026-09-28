import { render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { CATEGORY } from '@/modules/championships/client'
import { seasonTeamFixture, seasonTeamsFixture } from '@/modules/teams/components/team-list-item/team-list-item.fixtures'
import { getTeamSquad } from '../../data/get-team-squad'
import { teamSquadFixture } from '../squad-header/squad-header.fixtures'
import { SquadsScreen } from './squads-screen'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

describe('SquadsScreen', () => {
  beforeAll(() => {
    Object.defineProperty(Element.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() })
  })

  it('lists the teams and explains that the season has no squad yet when no team is selected', () => {
    render(<SquadsScreen year={2025} teams={seasonTeamsFixture} categoryFilter={undefined} selectedTeam={null} canEdit={false} requestedPlayerId={undefined} />)

    expect(screen.getByRole('complementary', { name: 'Times' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Nenhum elenco em 2025 ainda' })).toBeInTheDocument()
    expect(screen.getByText('Os elencos aparecem assim que as súmulas desta temporada forem importadas da FMF.')).toBeInTheDocument()
  })

  it('suggests changing the category filter when the filtered season has no team', () => {
    render(<SquadsScreen year={2025} teams={[]} categoryFilter={CATEGORY.SUB13} selectedTeam={null} canEdit={false} requestedPlayerId={undefined} />)

    expect(screen.getByRole('heading', { name: 'Nenhum time SUB-13 em 2025' })).toBeInTheDocument()
    expect(screen.getByText('Troque o filtro de categoria ou escolha outra temporada.')).toBeInTheDocument()
  })

  it('marks the selected team and loads its squad', () => {
    vi.mocked(getTeamSquad).mockResolvedValue(teamSquadFixture)

    render(<SquadsScreen year={2025} teams={seasonTeamsFixture} categoryFilter={undefined} selectedTeam={seasonTeamFixture} canEdit={false} requestedPlayerId={undefined} />)

    expect(screen.getByRole('link', { name: /Estrela do Vale/, current: true })).toBeInTheDocument()
    expect(getTeamSquad).toHaveBeenCalledWith(2025, seasonTeamFixture.category, seasonTeamFixture.clubId)
    expect(screen.queryByRole('heading', { name: 'Nenhum elenco em 2025 ainda' })).not.toBeInTheDocument()
  })
})
