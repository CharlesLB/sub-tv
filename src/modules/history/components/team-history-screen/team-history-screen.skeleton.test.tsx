import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TeamHistoryScreenSkeleton } from './team-history-screen.skeleton'

describe('TeamHistoryScreenSkeleton', () => {
  it('exposes no content to assistive technology while the team page loads', () => {
    render(<TeamHistoryScreenSkeleton />)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.queryByRole('figure')).not.toBeInTheDocument()
  })

  it('stands in for the back link, hero, indicators, chart, campaign and the side by side lists', () => {
    const { container } = render(<TeamHistoryScreenSkeleton />)

    const content = container.firstElementChild?.firstElementChild?.lastElementChild
    expect(content?.children).toHaveLength(6)
    expect(content?.lastElementChild?.children).toHaveLength(2)
  })

  it('draws eight season bars in the team chart track height', () => {
    const { container } = render(<TeamHistoryScreenSkeleton />)

    const bars = [...container.querySelectorAll<HTMLElement>('[style*="height"]')]
    expect(bars).toHaveLength(8)
    expect(bars[0]?.parentElement).toHaveClass('h-[92px]')
  })
})
