import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SeasonRailSkeleton } from './season-rail.skeleton'

const placeholderDelaysOf = (container: HTMLElement): (string | null)[] => Array.from(container.querySelectorAll('.animate-skeleton'), (placeholder) => placeholder.getAttribute('style'))

describe('SeasonRailSkeleton', () => {
  it('hides the rail from assistive technology and renders no controls', () => {
    const { container } = render(<SeasonRailSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelectorAll('a, button')).toHaveLength(0)
  })

  it('draws the season button, the previous arrow and five years before the divider', () => {
    const { container } = render(<SeasonRailSkeleton />)

    const [seasonControls] = Array.from(container.firstElementChild?.children ?? [])
    expect(seasonControls?.children).toHaveLength(3)
    expect(seasonControls?.lastElementChild?.children).toHaveLength(5)
  })

  it('draws five championship chips and the forward arrow after the divider', () => {
    const { container } = render(<SeasonRailSkeleton />)

    const [, , ribbon, forwardSlot] = Array.from(container.firstElementChild?.children ?? [])
    expect(ribbon?.children).toHaveLength(5)
    expect(forwardSlot?.querySelectorAll('.animate-skeleton')).toHaveLength(1)
  })

  it('staggers the placeholder animation from left to right', () => {
    const { container } = render(<SeasonRailSkeleton />)

    const delays = placeholderDelaysOf(container).map((style) => Number(style?.match(/\d+/)?.[0]))
    expect(delays).toEqual([...delays].sort((left, right) => left - right))
    expect(delays[0]).toBe(0)
  })
})
