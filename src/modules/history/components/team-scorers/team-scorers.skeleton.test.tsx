import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TeamScorersSkeleton } from './team-scorers.skeleton'

describe('TeamScorersSkeleton', () => {
  it('hides the scorers from assistive technology and exposes no link or heading', () => {
    const { container } = render(<TeamScorersSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('draws the six scorers the team page lists, alternating the row backgrounds', () => {
    const { container } = render(<TeamScorersSkeleton />)

    const rows = [...(container.firstElementChild?.lastElementChild?.children ?? [])]
    expect(rows).toHaveLength(6)
    expect(rows[0]).toHaveClass('bg-pan')
    expect(rows[1]).toHaveClass('bg-pan0')
  })
})
