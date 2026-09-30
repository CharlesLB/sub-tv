import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FORM_RESULT } from '../../lib/form-result/form-result'
import { FormSquare } from './form-square'
import { FORM_SQUARE_SIZE } from './form-square.styles'

describe('FormSquare', () => {
  it('shows a win with its title, win colors and the medium size by default', () => {
    render(<FormSquare result={FORM_RESULT.WIN} />)

    const square = screen.getByTitle('Vitória')
    expect(square).toHaveTextContent('V')
    expect(square).toHaveClass('bg-ac', 'size-[18px]')
  })

  it('shows a draw with its title and draw colors', () => {
    render(<FormSquare result={FORM_RESULT.DRAW} />)

    expect(screen.getByTitle('Empate')).toHaveClass('bg-bd2', 'text-tx')
  })

  it('shows a loss with its title in the small size', () => {
    render(<FormSquare result={FORM_RESULT.LOSS} size="small" />)

    expect(screen.getByTitle('Derrota')).toHaveClass('bg-vm', 'size-4')
  })

  it('shows a draw in the dense size with the lighter weight and its own ink', () => {
    render(<FormSquare result={FORM_RESULT.DRAW} size={FORM_SQUARE_SIZE.DENSE} />)

    const square = screen.getByTitle('Empate')
    expect(square).toHaveClass('size-[17px]', 'text-[9px]', 'font-medium', 'text-tx1')
    expect(square).not.toHaveClass('font-semibold')
  })
})
