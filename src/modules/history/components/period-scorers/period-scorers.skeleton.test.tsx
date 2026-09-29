import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PeriodScorersSkeleton } from './period-scorers.skeleton'

describe('PeriodScorersSkeleton', () => {
  it('hides the scorers from assistive technology and exposes no link or heading', () => {
    const { container } = render(<PeriodScorersSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.firstElementChild).toHaveClass('max-w-[720px]')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('draws the ten scorers the overview lists, alternating the row backgrounds', () => {
    const { container } = render(<PeriodScorersSkeleton />)

    const rows = [...(container.firstElementChild?.lastElementChild?.children ?? [])]
    expect(rows).toHaveLength(10)
    expect(rows[0]).toHaveClass('bg-pan')
    expect(rows[1]).toHaveClass('bg-pan0')
  })
})
