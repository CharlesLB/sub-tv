import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AccumulatedTableSkeleton } from './accumulated-table.skeleton'

const ROW_SELECTOR = '.border-l-\\[3px\\]'

describe('AccumulatedTableSkeleton', () => {
  it('hides the table from assistive technology and exposes no link or heading', () => {
    const { container } = render(<AccumulatedTableSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('draws eight rows with the leader accent only on the first one', () => {
    const { container } = render(<AccumulatedTableSkeleton />)

    const rows = [...container.querySelectorAll(ROW_SELECTOR)]
    expect(rows).toHaveLength(8)
    expect(rows[0]).toHaveClass('border-ac')
    expect(rows[1]).toHaveClass('border-transparent')
  })

  it('keeps the columns that the real table hides on phones hidden on phones', () => {
    const { container } = render(<AccumulatedTableSkeleton />)

    const firstRow = container.querySelector(ROW_SELECTOR)
    expect(firstRow?.querySelectorAll('.mobile\\:hidden')).toHaveLength(5)
  })
})
