import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PlatformRailSkeleton } from './platform-rail.skeleton'

describe('PlatformRailSkeleton', () => {
  it('shows the brand logo and no navigation while the rail loads', () => {
    render(<PlatformRailSkeleton />)

    expect(screen.getByTitle('sub.tv')).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('hides the rail from assistive technology', () => {
    const { container } = render(<PlatformRailSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws an icon and a label placeholder for each of the three destinations, staggered from top to bottom', () => {
    const { container } = render(<PlatformRailSkeleton />)

    const delays = Array.from(container.querySelectorAll('.animate-skeleton'), (placeholder) => placeholder.getAttribute('style'))
    expect(delays).toEqual(['animation-delay: 0ms;', 'animation-delay: 0ms;', 'animation-delay: 80ms;', 'animation-delay: 80ms;', 'animation-delay: 160ms;', 'animation-delay: 160ms;'])
  })
})
