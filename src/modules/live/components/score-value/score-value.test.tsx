import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ScoreValue } from './score-value'

const PULSE_CLASS = 'animate-score-pulse'

describe('ScoreValue', () => {
  it('shows the score without the pulse when it first renders', () => {
    render(<ScoreValue value={2} />)

    expect(screen.getByText('2')).not.toHaveClass(PULSE_CLASS)
  })

  it('pulses the score when its value changes', () => {
    const { rerender } = render(<ScoreValue value={0} />)

    rerender(<ScoreValue value={1} />)

    expect(screen.getByText('1')).toHaveClass(PULSE_CLASS)
  })

  it('keeps resting when it rerenders with the same value', () => {
    const { rerender } = render(<ScoreValue value={1} />)

    rerender(<ScoreValue value={1} />)

    expect(screen.getByText('1')).not.toHaveClass(PULSE_CLASS)
  })
})
