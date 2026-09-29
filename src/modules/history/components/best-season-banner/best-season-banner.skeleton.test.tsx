import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BestSeasonBannerSkeleton } from './best-season-banner.skeleton'

const HIDDEN_PLACEHOLDER_SELECTOR = 'span[aria-hidden="true"]'

describe('BestSeasonBannerSkeleton', () => {
  it('keeps the banner frame hidden from assistive technology with an icon and a text placeholder', () => {
    const { container } = render(<BestSeasonBannerSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.firstElementChild).toHaveClass('bg-pan2')
    expect(container.querySelectorAll(HIDDEN_PLACEHOLDER_SELECTOR)).toHaveLength(2)
  })
})
