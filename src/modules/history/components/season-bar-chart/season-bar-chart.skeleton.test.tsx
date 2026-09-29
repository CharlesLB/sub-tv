import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SeasonBarChartSkeleton } from './season-bar-chart.skeleton'

describe('SeasonBarChartSkeleton', () => {
  it('hides the chart from assistive technology and exposes no figure', () => {
    const { container } = render(<SeasonBarChartSkeleton barCount={8} trackHeightClass="h-[92px]" />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('figure')).not.toBeInTheDocument()
  })

  it('draws the requested bars with their fixed heights inside tracks of the given height', () => {
    const { container } = render(<SeasonBarChartSkeleton barCount={3} trackHeightClass="h-[88px]" />)

    const bars = [...container.querySelectorAll<HTMLElement>('[style*="height"]')]
    expect(bars.map((bar) => bar.style.height)).toEqual(['48%', '72%', '60%'])
    expect(bars[0]?.parentElement).toHaveClass('h-[88px]')
  })
})
