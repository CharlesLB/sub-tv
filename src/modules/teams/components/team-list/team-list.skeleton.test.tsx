import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TeamListSkeleton } from './team-list.skeleton'

describe('TeamListSkeleton', () => {
  it('hides the placeholder column from assistive technology', () => {
    const { container } = render(<TeamListSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
  })

  it('draws one placeholder per category filter option and eight team rows', () => {
    const { container } = render(<TeamListSkeleton />)

    const [filterLabel, filters, teamsLabel, teams] = Array.from(container.firstElementChild?.children ?? [])
    expect(filterLabel).toBeDefined()
    expect(teamsLabel).toBeDefined()
    expect(filters?.children).toHaveLength(3)
    expect(teams?.children).toHaveLength(8)
  })
})
