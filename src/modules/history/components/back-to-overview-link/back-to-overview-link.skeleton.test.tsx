import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BackToOverviewLinkSkeleton } from './back-to-overview-link.skeleton'

describe('BackToOverviewLinkSkeleton', () => {
  it('draws a hidden placeholder as tall as the link and exposes no link', () => {
    const { container } = render(<BackToOverviewLinkSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.firstElementChild).toHaveClass('h-8', 'self-start')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
