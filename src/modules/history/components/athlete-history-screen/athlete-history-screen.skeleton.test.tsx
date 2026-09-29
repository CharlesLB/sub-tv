import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AthleteHistoryScreenSkeleton } from './athlete-history-screen.skeleton'

describe('AthleteHistoryScreenSkeleton', () => {
  it('exposes no content to assistive technology while the athlete page loads', () => {
    render(<AthleteHistoryScreenSkeleton />)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.queryByRole('figure')).not.toBeInTheDocument()
  })

  it('stands in for the back link, hero, indicators, best season, chart and seasons table', () => {
    const { container } = render(<AthleteHistoryScreenSkeleton />)

    const content = container.firstElementChild?.firstElementChild?.lastElementChild
    expect(content?.children).toHaveLength(6)
  })

  it('draws two season bars in the athlete chart track height', () => {
    const { container } = render(<AthleteHistoryScreenSkeleton />)

    const bars = [...container.querySelectorAll<HTMLElement>('[style*="height"]')]
    expect(bars).toHaveLength(2)
    expect(bars[0]?.parentElement).toHaveClass('h-[88px]')
  })
})
