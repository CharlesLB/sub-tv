import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HEXAGON_MARK_SIZE, HexagonMark } from './hexagon-mark'

describe('HexagonMark', () => {
  it('draws a hidden hollow hexagon at the large size', () => {
    const { container } = render(<HexagonMark size={HEXAGON_MARK_SIZE.LARGE} />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.firstElementChild).toHaveClass('hexagon', 'h-[34px]', 'w-7')
    expect(container.firstElementChild?.firstElementChild).toHaveClass('hexagon', 'bg-pan')
  })

  it('draws a smaller hexagon at the small size', () => {
    const { container } = render(<HexagonMark size={HEXAGON_MARK_SIZE.SMALL} />)

    expect(container.firstElementChild).toHaveClass('h-[29px]', 'w-6')
  })
})
