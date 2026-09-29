import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChampionshipCardSkeleton } from './championship-card.skeleton'

const PLACEHOLDER_SELECTOR = '.animate-skeleton'
const HEADER_PLACEHOLDERS = 3
const PODIUM_PLACEHOLDERS = 3 * 4
const STATUS_PLACEHOLDERS = 3
const OPEN_LABEL_PLACEHOLDERS = 1

describe('ChampionshipCardSkeleton', () => {
  it('hides the placeholder card from assistive technology', () => {
    const { container } = render(<ChampionshipCardSkeleton index={0} />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws the header, three podium rows, the status line and the open label', () => {
    const { container } = render(<ChampionshipCardSkeleton index={0} />)

    expect(container.querySelectorAll(PLACEHOLDER_SELECTOR)).toHaveLength(HEADER_PLACEHOLDERS + PODIUM_PLACEHOLDERS + STATUS_PLACEHOLDERS + OPEN_LABEL_PLACEHOLDERS)
  })

  it('delays the animation of a later card after the earlier ones', () => {
    const { container } = render(<ChampionshipCardSkeleton index={2} />)

    expect(container.querySelector(PLACEHOLDER_SELECTOR)).toHaveStyle({ animationDelay: '240ms' })
  })
})
