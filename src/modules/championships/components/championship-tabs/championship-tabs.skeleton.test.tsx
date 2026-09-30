import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CHAMPIONSHIP_TABS } from '../../lib/championship-tab/championship-tab'
import { ChampionshipTabsSkeleton } from './championship-tabs.skeleton'

describe('ChampionshipTabsSkeleton', () => {
  it('hides the placeholder navigation from assistive technology', () => {
    const { container } = render(<ChampionshipTabsSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws one label placeholder per championship tab, staggered from left to right', () => {
    const { container } = render(<ChampionshipTabsSkeleton />)

    const delays = Array.from(container.querySelectorAll('.animate-skeleton'), (placeholder) => placeholder.getAttribute('style'))
    expect(delays).toHaveLength(CHAMPIONSHIP_TABS.length)
    expect(delays).toEqual(['animation-delay: 0ms;', 'animation-delay: 80ms;', 'animation-delay: 160ms;'])
  })
})
