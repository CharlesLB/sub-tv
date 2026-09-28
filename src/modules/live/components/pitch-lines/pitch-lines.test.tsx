import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PitchLines } from './pitch-lines'

const PITCH_MARKINGS = 7

describe('PitchLines', () => {
  it('draws the halfway line, center circle, center spot and both penalty and goal areas', () => {
    const { container } = render(<PitchLines />)

    expect(container.children).toHaveLength(PITCH_MARKINGS)
  })

  it('opens each penalty area towards its own goal line', () => {
    const { container } = render(<PitchLines />)

    expect(container.children[3]).toHaveClass('left-0', 'border-l-0')
    expect(container.children[5]).toHaveClass('right-0', 'border-r-0')
  })
})
