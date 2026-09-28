import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TooltipStat } from './tooltip-stat'

describe('TooltipStat', () => {
  it('shows the value next to its label', () => {
    render(<TooltipStat label="Gols" value={3} highlightClass="text-ac" />)

    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Gols')).toBeInTheDocument()
  })

  it('highlights a positive value with the given class', () => {
    render(<TooltipStat label="Gols" value={3} highlightClass="text-ac" />)

    expect(screen.getByText('3')).toHaveClass('text-ac')
  })

  it('keeps a zero value in the plain color even with a highlight class', () => {
    render(<TooltipStat label="Gols" value={0} highlightClass="text-ac" />)

    expect(screen.getByText('0')).toHaveClass('text-tx')
    expect(screen.getByText('0')).not.toHaveClass('text-ac')
  })

  it('keeps a positive value in the plain color when there is no highlight class', () => {
    render(<TooltipStat label="Jogos" value={9} highlightClass={null} />)

    expect(screen.getByText('9')).toHaveClass('text-tx')
  })
})
