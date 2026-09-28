import { render, screen, within } from '@testing-library/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { seasonTeamFixture, seasonTeamsFixture, secondSeasonTeamFixture } from '../team-list-item/team-list-item.fixtures'
import { TeamList } from './team-list'

describe('TeamList', () => {
  beforeAll(() => {
    Object.defineProperty(Element.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() })
  })

  it('shows the category filter and one link per team with the active one marked', () => {
    render(<TeamList teams={seasonTeamsFixture} year={2025} categoryFilter={undefined} activeTeamKey={secondSeasonTeamFixture.key} />)

    const list = screen.getByRole('complementary', { name: 'Times' })
    expect(within(list).getByRole('navigation', { name: 'Filtro de categoria' })).toBeInTheDocument()
    expect(within(list).getByRole('link', { name: /Estrela do Vale/ })).not.toHaveAttribute('aria-current')
    expect(within(list).getByRole('link', { name: /Serra Azul FC/ })).toHaveAttribute('aria-current', 'true')
    expect(screen.queryByText('Nenhum time nesta categoria.')).not.toBeInTheDocument()
  })

  it('scrolls the active team into view', () => {
    render(<TeamList teams={seasonTeamsFixture} year={2025} categoryFilter={undefined} activeTeamKey={seasonTeamFixture.key} />)

    expect(Element.prototype.scrollIntoView).toHaveBeenCalled()
  })

  it('says there is no team when the category has none', () => {
    render(<TeamList teams={[]} year={2025} categoryFilter={undefined} activeTeamKey={null} />)

    expect(screen.getByText('Nenhum time nesta categoria.')).toBeInTheDocument()
  })
})
