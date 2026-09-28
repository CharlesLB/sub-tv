import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { recentFormFixture } from '../form-square/form-square.fixtures'
import { FormSquares } from './form-squares'

describe('FormSquares', () => {
  it('renders one square per recent result in order', () => {
    render(<FormSquares form={recentFormFixture} />)

    expect(screen.getAllByTitle(/Vitória|Empate|Derrota/).map((square) => square.textContent)).toEqual(['V', 'V', 'E', 'D', 'V'])
  })

  it('applies extra class names to the row', () => {
    render(<FormSquares form={recentFormFixture} className="compact:hidden" />)

    expect(screen.getAllByTitle('Vitória')[0]?.parentElement).toHaveClass('compact:hidden')
  })

  it('renders an empty row when there is no recent result', () => {
    render(<FormSquares form={[]} />)

    expect(screen.queryByTitle(/Vitória|Empate|Derrota/)).not.toBeInTheDocument()
  })
})
