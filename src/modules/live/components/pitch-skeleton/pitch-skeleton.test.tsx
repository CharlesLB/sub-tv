import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PitchSkeleton } from './pitch-skeleton'

const PLACEHOLDER_DOTS = 14

describe('PitchSkeleton', () => {
  it('draws a placeholder dot for every starter of both teams', () => {
    const { container } = render(<PitchSkeleton />)

    expect(container.querySelectorAll('.size-\\[26px\\]')).toHaveLength(PLACEHOLDER_DOTS)
  })

  it('fades the away team placeholder dots', () => {
    const { container } = render(<PitchSkeleton />)

    expect(container.querySelectorAll('.size-\\[26px\\].bg-pan2')).toHaveLength(PLACEHOLDER_DOTS / 2)
  })

  it('hides every placeholder from assistive technology', () => {
    const { container } = render(<PitchSkeleton />)

    expect(container.querySelectorAll('.size-\\[26px\\]:not([aria-hidden="true"])')).toHaveLength(0)
  })
})
