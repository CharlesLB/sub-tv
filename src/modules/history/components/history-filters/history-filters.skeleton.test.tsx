import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HistoryFiltersSkeleton } from './history-filters.skeleton'

const HIDDEN_PLACEHOLDER_SELECTOR = 'span[aria-hidden="true"]'

describe('HistoryFiltersSkeleton', () => {
  it('hides the whole filter placeholder from assistive technology and exposes no link', () => {
    const { container } = render(<HistoryFiltersSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('draws two labels, three category chips and eleven season chips', () => {
    const { container } = render(<HistoryFiltersSkeleton />)

    expect(container.querySelectorAll(HIDDEN_PLACEHOLDER_SELECTOR)).toHaveLength(16)
  })

  it('keeps the real filter rows so the chips start where the real chips start', () => {
    const { container } = render(<HistoryFiltersSkeleton />)

    const [categoryRow, seasonRow] = container.firstElementChild?.children ?? []
    expect(categoryRow).toHaveClass('flex-wrap', 'items-center')
    expect(seasonRow?.firstElementChild).toHaveClass('w-[66px]', 'pt-2')
  })
})
