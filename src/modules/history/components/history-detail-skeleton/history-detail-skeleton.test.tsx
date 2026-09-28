import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HistoryDetailSkeleton } from './history-detail-skeleton'

const HIDDEN_PLACEHOLDER_SELECTOR = 'span[aria-hidden="true"]'

describe('HistoryDetailSkeleton', () => {
  it('exposes no content to assistive technology while the detail page loads', () => {
    render(<HistoryDetailSkeleton />)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('draws placeholders for filters, hero, indicators, season chart and season rows', () => {
    const { container } = render(<HistoryDetailSkeleton />)

    expect(container.querySelectorAll(HIDDEN_PLACEHOLDER_SELECTOR)).toHaveLength(58)
  })

  it('draws the eight season chart bars with their fixed heights', () => {
    const { container } = render(<HistoryDetailSkeleton />)

    const bars = [...container.querySelectorAll<HTMLElement>('[style*="height"]')]
    expect(bars.map((bar) => bar.style.height)).toEqual(['48%', '72%', '60%', '86%', '54%', '78%', '66%', '92%'])
  })
})
