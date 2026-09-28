import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RowChevron } from './row-chevron'

describe('RowChevron', () => {
  it('renders a decorative chevron hidden from assistive technology', () => {
    const { container } = render(<RowChevron />)

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
})
