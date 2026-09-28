import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HistoryOverviewSkeleton } from './history-overview-skeleton'

const HIDDEN_PLACEHOLDER_SELECTOR = 'span[aria-hidden="true"]'

describe('HistoryOverviewSkeleton', () => {
  it('exposes no content to assistive technology while the overview loads', () => {
    render(<HistoryOverviewSkeleton />)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('draws placeholders for filters, indicators, highlights and the table rows', () => {
    const { container } = render(<HistoryOverviewSkeleton />)

    expect(container.querySelectorAll(HIDDEN_PLACEHOLDER_SELECTOR)).toHaveLength(63)
  })
})
