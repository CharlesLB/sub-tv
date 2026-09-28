import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SeasonRailSkeleton } from './season-rail-skeleton'

describe('SeasonRailSkeleton', () => {
  it('renders a hidden placeholder for the season button, the years and two championship chips', () => {
    const { container } = render(<SeasonRailSkeleton />)

    const rail = container.firstElementChild
    expect(rail).toHaveAttribute('aria-hidden', 'true')
    expect(rail?.children).toHaveLength(5)
  })

  it('staggers the placeholder animation from left to right', () => {
    const { container } = render(<SeasonRailSkeleton />)

    const delays = Array.from(container.querySelectorAll('.animate-skeleton'), (placeholder) => placeholder.getAttribute('style'))
    expect(delays).toEqual(['animation-delay: 0ms;', 'animation-delay: 80ms;', 'animation-delay: 160ms;', 'animation-delay: 240ms;'])
  })
})
