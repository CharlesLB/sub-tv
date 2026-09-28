import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { KpiCard } from './kpi-card'

describe('KpiCard', () => {
  it('shows the value above its label', () => {
    render(<KpiCard label="Gols" value="17" index={0} variant="detail" />)

    expect(screen.getByText('17')).toBeInTheDocument()
    expect(screen.getByText('Gols')).toBeInTheDocument()
  })

  it('delays the entrance by fifty five milliseconds per position in the overview variant', () => {
    render(<KpiCard label="Gols" value="540" index={2} variant="overview" />)

    expect(screen.getByText('540').parentElement).toHaveStyle({ animationDelay: '110ms' })
  })

  it('delays the entrance by fifty milliseconds per position in the detail variant', () => {
    render(<KpiCard label="Gols" value="17" index={2} variant="detail" />)

    expect(screen.getByText('17').parentElement).toHaveStyle({ animationDelay: '100ms' })
  })
})
