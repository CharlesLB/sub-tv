import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FormSquares } from './form-squares'

describe('FormSquares', () => {
  it('renders one square per result in the given order', () => {
    const { container } = render(<FormSquares form={['V', 'E', 'D', 'V']} />)

    expect(container).toHaveTextContent('VEDV')
    expect(screen.getAllByText('V')).toHaveLength(2)
  })

  it('renders nothing inside the strip when there are no results', () => {
    const { container } = render(<FormSquares form={[]} />)

    expect(container.firstElementChild).toBeEmptyDOMElement()
  })
})
