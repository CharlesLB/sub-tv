import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LiveSkeleton } from './live-skeleton'

describe('LiveSkeleton', () => {
  it('hides the whole placeholder screen from assistive technology', () => {
    const { container } = render(<LiveSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws a placeholder for every officials strip item and fades the last three', () => {
    const { container } = render(<LiveSkeleton />)

    const officialsBars = container.querySelectorAll('.h-\\[18px\\] > span')
    expect(officialsBars).toHaveLength(6)
    expect(Array.from(officialsBars).filter((bar) => bar.classList.contains('bg-pan2'))).toHaveLength(3)
  })

  it('draws three event chip placeholders and the pitch between both benches', () => {
    const { container } = render(<LiveSkeleton />)

    expect(container.querySelectorAll('.w-\\[150px\\]')).toHaveLength(3)
    expect(container.querySelectorAll('.turf')).toHaveLength(1)
  })
})
