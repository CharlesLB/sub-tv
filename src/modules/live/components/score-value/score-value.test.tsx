import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ScoreValue } from './score-value'

describe('ScoreValue', () => {
  it('shows the score without the pulse before any goal is recorded', () => {
    render(<ScoreValue value={0} pulseCount={0} />)

    expect(screen.getByText('0')).not.toHaveClass('animate-score-pulse')
  })

  it('pulses the score after a goal is recorded', () => {
    render(<ScoreValue value={2} pulseCount={1} />)

    expect(screen.getByText('2')).toHaveClass('animate-score-pulse')
  })
})
