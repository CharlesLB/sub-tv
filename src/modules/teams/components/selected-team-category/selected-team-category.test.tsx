import { render, screen } from '@testing-library/react'
import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation'
import { describe, expect, it, vi } from 'vitest'
import { seasonTeamsFixture, secondSeasonTeamFixture } from '../team-list-item/team-list-item.fixtures'
import { SelectedTeamCategory } from './selected-team-category'

vi.mock(import('next/navigation'), async (importOriginal) => ({ ...(await importOriginal()), useSearchParams: vi.fn() }))

const arrangeQuery = (search: string) => vi.mocked(useSearchParams).mockReturnValue(new ReadonlyURLSearchParams(search))

describe('SelectedTeamCategory', () => {
  it('shows the category of the team named by the address', () => {
    arrangeQuery(`time=${secondSeasonTeamFixture.key}`)

    render(<SelectedTeamCategory teams={seasonTeamsFixture} />)

    expect(screen.getByText('SUB-13')).toBeInTheDocument()
  })

  it('shows the category of the first team when the address names none', () => {
    arrangeQuery('')

    render(<SelectedTeamCategory teams={seasonTeamsFixture} />)

    expect(screen.getByText('SUB-14')).toBeInTheDocument()
  })

  it('shows nothing when the season has no team', () => {
    arrangeQuery('')

    const { container } = render(<SelectedTeamCategory teams={[]} />)

    expect(container).toBeEmptyDOMElement()
  })
})
