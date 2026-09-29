import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StandingsTableSkeleton } from './standings-table.skeleton'

const ROW_SELECTOR = ':scope > div > div.h-11'

describe('StandingsTableSkeleton', () => {
  it('hides the placeholder table from assistive technology', () => {
    const { container } = render(<StandingsTableSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('keeps the static column headers of the real table', () => {
    render(<StandingsTableSkeleton />)

    expect(screen.getByText('Clube')).toBeInTheDocument()
    expect(screen.getByText('Últimos 5')).toBeInTheDocument()
  })

  it('draws ten team row placeholders', () => {
    const { container } = render(<StandingsTableSkeleton />)

    expect(container.querySelectorAll(ROW_SELECTOR)).toHaveLength(10)
  })
})
