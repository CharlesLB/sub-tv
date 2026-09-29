import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HistoryOverviewScreenSkeleton } from './history-overview-screen.skeleton'

const HIDDEN_PLACEHOLDER_SELECTOR = '[aria-hidden="true"]'

describe('HistoryOverviewScreenSkeleton', () => {
  it('exposes no content to assistive technology while the overview loads', () => {
    render(<HistoryOverviewScreenSkeleton />)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })

  it('stands in for the filters, indicators, highlights, accumulated table and period scorers in screen order', () => {
    const { container } = render(<HistoryOverviewScreenSkeleton />)

    const sections = [...(container.firstElementChild?.firstElementChild?.children ?? [])]
    expect(sections).toHaveLength(5)
    expect(sections.every((section) => section.matches(HIDDEN_PLACEHOLDER_SELECTOR))).toBe(true)
  })
})
