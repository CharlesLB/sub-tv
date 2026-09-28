import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HistorySection } from './history-section'

describe('HistorySection', () => {
  it('renders a region named by its title with a level two heading and the children', () => {
    render(
      <HistorySection title="Artilheiros do time">
        <p>Lista de artilheiros</p>
      </HistorySection>,
    )

    const section = screen.getByRole('region', { name: 'Artilheiros do time' })
    expect(section).toContainElement(screen.getByRole('heading', { level: 2, name: 'Artilheiros do time' }))
    expect(section).toContainElement(screen.getByText('Lista de artilheiros'))
  })

  it('adds the extra class name to the section', () => {
    render(
      <HistorySection title="Artilheiros do time" className="max-w-[720px]">
        <p>Lista de artilheiros</p>
      </HistorySection>,
    )

    expect(screen.getByRole('region', { name: 'Artilheiros do time' })).toHaveClass('max-w-[720px]')
  })
})
