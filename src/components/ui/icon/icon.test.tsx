import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Icon } from './icon'

describe('Icon', () => {
  it('hides a decorative icon from assistive technology and uses the default size', () => {
    const { container } = render(<Icon name="trophy" />)

    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).not.toHaveAttribute('role')
    expect(svg).toHaveAttribute('width', '16')
    expect(svg).toHaveAttribute('height', '16')
  })

  it('exposes a labeled icon as an image with its label and the requested size', () => {
    render(<Icon name="error" size={26} label="Erro" className="text-am" />)

    const image = screen.getByRole('img', { name: 'Erro' })
    expect(image).not.toHaveAttribute('aria-hidden')
    expect(image).toHaveAttribute('width', '26')
    expect(image).toHaveClass('flex-none', 'text-am')
  })
})
