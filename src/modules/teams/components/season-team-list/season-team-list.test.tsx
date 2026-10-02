import { render, screen } from '@testing-library/react'
import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { CATEGORY } from '@/modules/championships/client'
import { seasonTeamsFixture, secondSeasonTeamFixture } from '../team-list-item/team-list-item.fixtures'
import { SeasonTeamList } from './season-team-list'

vi.mock(import('next/navigation'), async (importOriginal) => ({ ...(await importOriginal()), useSearchParams: vi.fn() }))

const arrangeQuery = (search: string) => vi.mocked(useSearchParams).mockReturnValue(new ReadonlyURLSearchParams(search))

describe('SeasonTeamList', () => {
  beforeAll(() => {
    Object.defineProperty(Element.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() })
  })

  it('marks the first team as active when the address names no team', () => {
    arrangeQuery('')

    render(<SeasonTeamList teams={seasonTeamsFixture} year={2025} />)

    expect(screen.getByRole('link', { name: /Estrela do Vale/ })).toHaveAttribute('aria-current', 'true')
    expect(screen.getByRole('link', { name: /Serra Azul FC/ })).not.toHaveAttribute('aria-current')
  })

  it('marks the team named by the address as active', () => {
    arrangeQuery(`time=${secondSeasonTeamFixture.key}`)

    render(<SeasonTeamList teams={seasonTeamsFixture} year={2025} />)

    expect(screen.getByRole('link', { name: /Serra Azul FC/ })).toHaveAttribute('aria-current', 'true')
  })

  it('lists only the teams of the category in the address', () => {
    arrangeQuery(`cat=${CATEGORY.SUB13}`)

    render(<SeasonTeamList teams={seasonTeamsFixture} year={2025} />)

    expect(screen.queryByRole('link', { name: /Estrela do Vale/ })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'SUB-13', current: true })).toBeInTheDocument()
  })
})
