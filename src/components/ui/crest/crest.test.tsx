import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Crest } from './crest'
import { CREST_COLOR, CREST_IMAGE_PATH } from './crest.fixtures'

const IMAGE_SELECTOR = 'img'
const HEXAGON_SELECTOR = 'span'

describe('Crest', () => {
  it('draws a hexagon in the team color with the default size when there is no image', () => {
    const { container } = render(<Crest color={CREST_COLOR} />)

    const hexagon = container.querySelector(HEXAGON_SELECTOR)
    expect(hexagon).toHaveAttribute('aria-hidden', 'true')
    expect(hexagon).toHaveStyle({ width: '18px', height: '22px', background: CREST_COLOR })
    expect(container.querySelector(IMAGE_SELECTOR)).not.toBeInTheDocument()
  })

  it('keeps the height proportional to a custom width and adds the extra class', () => {
    const { container } = render(<Crest color={CREST_COLOR} width={40} className="mt-2" />)

    const hexagon = container.querySelector(HEXAGON_SELECTOR)
    expect(hexagon).toHaveStyle({ width: '40px', height: '48px' })
    expect(hexagon).toHaveClass('hexagon', 'mt-2')
  })

  it('renders the downloaded crest image instead of the hexagon when an image path is given', () => {
    const { container } = render(<Crest color={CREST_COLOR} imagePath={CREST_IMAGE_PATH} width={30} />)

    const image = container.querySelector(IMAGE_SELECTOR)
    expect(image).toHaveAttribute('alt', '')
    expect(image).toHaveAttribute('width', '30')
    expect(image).toHaveAttribute('height', '36')
    expect(container.querySelector(HEXAGON_SELECTOR)).not.toBeInTheDocument()
  })
})
