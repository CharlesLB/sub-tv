import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RoundMatchCardSkeleton } from './round-match-card.skeleton'

const PLACEHOLDER_SELECTOR = '.animate-skeleton'
const KICKER_PLACEHOLDERS = 1
const TEAM_LINE_PLACEHOLDERS = 2 * 3
const ACTION_PLACEHOLDERS = 1

describe('RoundMatchCardSkeleton', () => {
  it('hides the placeholder card from assistive technology', () => {
    const { container } = render(<RoundMatchCardSkeleton index={0} />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws the kicker, both team lines and the action button', () => {
    const { container } = render(<RoundMatchCardSkeleton index={0} />)

    expect(container.querySelectorAll(PLACEHOLDER_SELECTOR)).toHaveLength(KICKER_PLACEHOLDERS + TEAM_LINE_PLACEHOLDERS + ACTION_PLACEHOLDERS)
  })

  it('delays the animation of a later card after the earlier ones', () => {
    const { container } = render(<RoundMatchCardSkeleton index={2} />)

    expect(container.querySelector(PLACEHOLDER_SELECTOR)).toHaveStyle({ animationDelay: '240ms' })
  })
})
