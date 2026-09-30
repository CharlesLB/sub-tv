import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { routes } from '@/lib/routes'
import { CATEGORY } from '@/modules/championships/client'
import { ACTIVE_TEAM_ATTRIBUTE } from '../../lib/active-team/active-team'
import { TeamListItem } from './team-list-item'
import { seasonTeamFixture } from './team-list-item.fixtures'

describe('TeamListItem', () => {
  it('links to the team squad showing its name, category and athlete count', () => {
    render(<TeamListItem team={seasonTeamFixture} year={2025} categoryFilter={CATEGORY.SUB14} isActive={false} />)

    const link = screen.getByRole('link', { name: /Estrela do Vale/ })
    expect(link).toHaveTextContent('Estrela do ValeSUB-1424')
    expect(link).toHaveAttribute('href', routes.squads({ year: 2025, category: CATEGORY.SUB14, teamKey: seasonTeamFixture.key }))
    expect(link).not.toHaveAttribute('aria-current')
    expect(link).not.toHaveAttribute(ACTIVE_TEAM_ATTRIBUTE)
  })

  it('marks the active team as current and as the scroll target', () => {
    render(<TeamListItem team={seasonTeamFixture} year={2025} categoryFilter={undefined} isActive />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('aria-current', 'true')
    expect(link).toHaveAttribute(ACTIVE_TEAM_ATTRIBUTE, 'true')
  })
})
