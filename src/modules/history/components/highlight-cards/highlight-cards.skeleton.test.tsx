import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HighlightCardsSkeleton } from './highlight-cards.skeleton'

const HIDDEN_PLACEHOLDER_SELECTOR = 'span[aria-hidden="true"]'

describe('HighlightCardsSkeleton', () => {
  it('hides the highlights from assistive technology and exposes no link', () => {
    const { container } = render(<HighlightCardsSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('draws three cards with a label, a value and a name placeholder each', () => {
    const { container } = render(<HighlightCardsSkeleton />)

    expect(container.firstElementChild?.children).toHaveLength(3)
    expect(container.querySelectorAll(HIDDEN_PLACEHOLDER_SELECTOR)).toHaveLength(9)
  })
})
