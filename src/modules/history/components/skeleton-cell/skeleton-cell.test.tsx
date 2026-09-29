import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SkeletonCell } from './skeleton-cell'

describe('SkeletonCell', () => {
  it('keeps the real cell class on the wrapper and draws a one line bar inside it', () => {
    const { container } = render(<SkeletonCell cellClassName="w-[46px] flex-none text-[15.3px]" barClassName="w-[38px]" delayMs={0} />)

    const cell = container.firstElementChild
    expect(cell).toHaveClass('w-[46px]', 'text-[15.3px]')
    expect(cell?.firstElementChild).toHaveClass('h-[1lh]', 'w-[38px]')
    expect(cell?.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('delays the bar pulse by the given milliseconds', () => {
    const { container } = render(<SkeletonCell cellClassName="flex-1" barClassName="w-1/2" delayMs={90} />)

    expect(container.querySelector('span span')).toHaveStyle({ animationDelay: '90ms' })
  })
})
