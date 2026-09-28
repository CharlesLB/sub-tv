import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BrandLogo } from './brand-logo'

describe('BrandLogo', () => {
  it('shows the sub.tv wordmark with the brand name as its title', () => {
    render(<BrandLogo />)

    expect(screen.getByTitle('sub.tv')).toHaveTextContent('sub.tv')
  })

  it('hides the drawn mark from assistive technology', () => {
    const { container } = render(<BrandLogo />)

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
})
