import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FORM_RESULT } from '../../form-result/form-result'
import { FormSquare } from './form-square'

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
})
