import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ROSTER_COLUMNS } from '../../lib/roster-columns/roster-columns'
import { RosterTableSkeleton } from './roster-table.skeleton'

describe('RosterTableSkeleton', () => {
  it('hides the column header and the rows from assistive technology', () => {
    const { container } = render(<RosterTableSkeleton />)

    expect(container.children).toHaveLength(2)
    expect(container.children[0]).toHaveAttribute('aria-hidden', 'true')
    expect(container.children[1]).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws one header cell per column and twelve rows with a cell per column', () => {
    const { container } = render(<RosterTableSkeleton />)

    const rows = container.children[1]?.children
    expect(container.children[0]?.children).toHaveLength(ROSTER_COLUMNS.length)
    expect(rows).toHaveLength(12)
    expect(rows?.[0]?.children).toHaveLength(ROSTER_COLUMNS.length)
  })
})
