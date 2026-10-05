import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CATEGORY } from '@/modules/championships/client'
import { seasonTeamsFixture, secondSeasonTeamFixture } from '@/modules/teams/components/team-list-item/team-list-item.fixtures'
import { SquadSection } from '../squad-section/squad-section'
import { SquadPanel } from './squad-panel'

const NO_QUERY = { category: undefined, teamKey: undefined }

describe('SquadPanel', () => {
  it('explains that the season has no squad yet when it has no team', () => {
    render(<SquadPanel year={2025} teams={[]} query={NO_QUERY} requestedPlayerId={undefined} />)

    expect(screen.getByRole('heading', { name: 'Nenhum elenco em 2025 ainda' })).toBeInTheDocument()
    expect(screen.getByText('Os elencos aparecem assim que as súmulas desta temporada forem importadas da FMF.')).toBeInTheDocument()
  })

  it('suggests changing the category filter when the filtered season has no team', () => {
    render(<SquadPanel year={2025} teams={[]} query={{ category: CATEGORY.SUB13, teamKey: undefined }} requestedPlayerId={undefined} />)

    expect(screen.getByRole('heading', { name: 'Nenhum time SUB-13 em 2025' })).toBeInTheDocument()
    expect(screen.getByText('Troque o filtro de categoria ou escolha outra temporada.')).toBeInTheDocument()
  })

  it('shows the squad section of the team named by the address', () => {
    const panel = SquadPanel({ year: 2025, teams: seasonTeamsFixture, query: { category: undefined, teamKey: secondSeasonTeamFixture.key }, requestedPlayerId: 'player-7' })

    expect(panel).toEqual(<SquadSection year={2025} team={secondSeasonTeamFixture} categoryFilter={undefined} requestedPlayerId="player-7" />)
  })
})
