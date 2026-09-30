import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LogoMark } from './logo-mark'

describe('LogoMark', () => {
  it('draws the mark at the requested size', () => {
    const { container } = render(<LogoMark size={48} />)

    expect(container.querySelector('svg')).toHaveAttribute('width', '48')
    expect(container.querySelector('svg')).toHaveAttribute('height', '48')
  })

  it('hides the mark from assistive technology', () => {
    const { container } = render(<LogoMark size={32} />)

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
})
