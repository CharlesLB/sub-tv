import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { KpiGrid } from './kpi-grid'
import { kpisFixture } from './kpi-grid.fixtures'

describe('KpiGrid', () => {
  it('renders one card per indicator with its value and label', () => {
    render(<KpiGrid kpis={kpisFixture} variant="detail" />)

    expect(screen.getByText('Gols por jogo')).toBeInTheDocument()
    expect(screen.getByText('0,71')).toBeInTheDocument()
    expect(screen.getByText('Temporadas')).toBeInTheDocument()
  })

  it('staggers the cards by their position in the grid', () => {
    render(<KpiGrid kpis={kpisFixture} variant="detail" />)

    expect(screen.getByText('Temporadas').parentElement).toHaveStyle({ animationDelay: '150ms' })
  })
})
