import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Skeleton } from './skeleton'

describe('Skeleton', () => {
  it('renders a hidden placeholder without animation delay by default', () => {
    const { container } = render(<Skeleton />)

    const placeholder = container.firstElementChild
    expect(placeholder).toHaveAttribute('aria-hidden', 'true')
    expect(placeholder).toHaveClass('animate-skeleton')
    expect(placeholder).toHaveStyle({ animationDelay: '0ms' })
  })

  it('applies the delay, the extra class and the extra style when they are given', () => {
    const { container } = render(<Skeleton className="h-4" delayMs={120} style={{ width: '50%' }} />)

    const placeholder = container.firstElementChild
    expect(placeholder).toHaveClass('h-4')
    expect(placeholder).toHaveStyle({ animationDelay: '120ms', width: '50%' })
  })
})
