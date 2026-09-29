import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DragGhost } from './drag-ghost'

describe('DragGhost', () => {
  it('renders the dragged player in the document body at the pointer position', () => {
    render(<DragGhost shirtNumber={12} name="Otávio" color="#1f4fa3" left={140} top={260} isOverTarget={false} />)

    const ghost = screen.getByText('Otávio').parentElement

    expect(ghost?.parentElement).toBe(document.body)
    expect(ghost).toHaveAttribute('aria-hidden', 'true')
    expect(ghost).toHaveStyle({ left: '140px', top: '260px' })
  })

  it('paints the shirt number with the team color', () => {
    render(<DragGhost shirtNumber={12} name="Otávio" color="#1f4fa3" left={140} top={260} isOverTarget={false} />)

    expect(screen.getByText('12')).toHaveStyle({ color: '#1f4fa3' })
  })

  it('highlights the border when the pointer is over a drop target', () => {
    render(<DragGhost shirtNumber={12} name="Otávio" color="#1f4fa3" left={0} top={0} isOverTarget />)

    expect(screen.getByText('Otávio').parentElement).toHaveClass('border-az')
  })

  it('keeps the neutral border when there is no drop target', () => {
    render(<DragGhost shirtNumber={12} name="Otávio" color="#1f4fa3" left={0} top={0} isOverTarget={false} />)

    expect(screen.getByText('Otávio').parentElement).toHaveClass('border-bd2')
  })
})
