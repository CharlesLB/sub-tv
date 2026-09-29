import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AthleteSeasonsTableSkeleton } from './athlete-seasons-table.skeleton'

describe('AthleteSeasonsTableSkeleton', () => {
  it('hides the seasons from assistive technology and exposes no link or heading', () => {
    const { container } = render(<AthleteSeasonsTableSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('draws the two seasons a youth athlete usually plays, alternating the row backgrounds', () => {
    const { container } = render(<AthleteSeasonsTableSkeleton />)

    const rows = [...(container.firstElementChild?.lastElementChild?.children ?? [])]
    expect(rows).toHaveLength(2)
    expect(rows[0]).toHaveClass('bg-pan')
    expect(rows[1]).toHaveClass('bg-pan0')
  })
})
