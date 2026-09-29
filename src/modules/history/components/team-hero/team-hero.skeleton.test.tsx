import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TeamHeroSkeleton } from './team-hero.skeleton'

const HIDDEN_PLACEHOLDER_SELECTOR = 'span[aria-hidden="true"]'

describe('TeamHeroSkeleton', () => {
  it('hides the hero from assistive technology', () => {
    const { container } = render(<TeamHeroSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws the badge, the name, the category and the subtitle placeholders', () => {
    const { container } = render(<TeamHeroSkeleton />)

    expect(container.querySelectorAll(HIDDEN_PLACEHOLDER_SELECTOR)).toHaveLength(4)
    expect(container.querySelector(HIDDEN_PLACEHOLDER_SELECTOR)).toHaveClass('size-[54px]')
  })
})
