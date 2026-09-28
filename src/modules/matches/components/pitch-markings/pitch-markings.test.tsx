import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PitchMarkings } from './pitch-markings'

const MARKING_COUNT = 7

describe('PitchMarkings', () => {
  it('draws every pitch line hidden from assistive technology', () => {
    const { container } = render(<PitchMarkings />)

    const markings = Array.from(container.children)

    expect(markings).toHaveLength(MARKING_COUNT)
    expect(markings.every((marking) => marking.getAttribute('aria-hidden') === 'true')).toBe(true)
  })
})
