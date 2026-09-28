import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { OfficialsStrip } from './officials-strip'
import { officialsStripItemsFixture } from './officials-strip.fixtures'

describe('OfficialsStrip', () => {
  it('shows the label and value of every item', () => {
    render(<OfficialsStrip items={officialsStripItemsFixture} />)

    expect(screen.getByText('Árbitro')).toBeInTheDocument()
    expect(screen.getByText('Rogério Tavares')).toBeInTheDocument()
    expect(screen.getByText('Rodada 7')).toBeInTheDocument()
    expect(screen.getByText('2 × 30 Min')).toBeInTheDocument()
  })

  it('renders an empty strip when there are no items', () => {
    const { container } = render(<OfficialsStrip items={[]} />)

    expect(container.firstElementChild).toBeEmptyDOMElement()
  })
})
