import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { routes } from '@/lib/routes'
import { CATEGORY } from '@/modules/championships/client'
import { toTeamKey } from '../../lib/team-key/team-key'
import { seasonTeamFixture } from '../team-list-item/team-list-item.fixtures'
import { CategoryFilter } from './category-filter'

describe('CategoryFilter', () => {
  it('offers every category plus all of them, keeping the active club in each link', () => {
    render(<CategoryFilter year={2025} activeCategory={undefined} activeTeamKey={seasonTeamFixture.key} />)

    expect(screen.getByRole('navigation', { name: 'Filtro de categoria' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Todas' })).toHaveAttribute('href', routes.squads({ year: 2025, teamKey: seasonTeamFixture.key }))
    expect(screen.getByRole('link', { name: 'SUB-14' })).toHaveAttribute('href', routes.squads({ year: 2025, category: CATEGORY.SUB14, teamKey: seasonTeamFixture.key }))
  })

  it('points the link of the other category to the same club in that category', () => {
    render(<CategoryFilter year={2025} activeCategory={undefined} activeTeamKey={seasonTeamFixture.key} />)

    expect(screen.getByRole('link', { name: 'SUB-13' })).toHaveAttribute('href', routes.squads({ year: 2025, category: CATEGORY.SUB13, teamKey: toTeamKey(CATEGORY.SUB13, seasonTeamFixture.clubId) }))
  })

  it('marks all categories as current when no category is filtered', () => {
    render(<CategoryFilter year={2025} activeCategory={undefined} activeTeamKey={null} />)

    expect(screen.getByRole('link', { current: true })).toHaveTextContent('Todas')
  })

  it('marks the filtered category as current and leaves the team out when none is active', () => {
    render(<CategoryFilter year={2025} activeCategory={CATEGORY.SUB14} activeTeamKey={null} />)

    expect(screen.getByRole('link', { current: true })).toHaveTextContent('SUB-14')
    expect(screen.getByRole('link', { name: 'Todas' })).toHaveAttribute('href', routes.squads({ year: 2025 }))
  })
})
