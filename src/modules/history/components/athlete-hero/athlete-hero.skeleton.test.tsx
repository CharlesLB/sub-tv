import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AthleteHeroSkeleton } from './athlete-hero.skeleton'

const HIDDEN_PLACEHOLDER_SELECTOR = 'span[aria-hidden="true"]'

describe('AthleteHeroSkeleton', () => {
  it('hides the hero from assistive technology', () => {
    const { container } = render(<AthleteHeroSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws the shirt number and three lines: name with nickname, position with team, and subtitle', () => {
    const { container } = render(<AthleteHeroSkeleton />)

    expect(container.querySelectorAll(HIDDEN_PLACEHOLDER_SELECTOR)).toHaveLength(6)
    expect(container.firstElementChild?.lastElementChild?.children).toHaveLength(3)
  })
})
