import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SquadsEmptyState } from './squads-empty-state'

describe('SquadsEmptyState', () => {
  it('shows the given title as a heading and the description', () => {
    render(<SquadsEmptyState title="Nenhum elenco em 2025 ainda" description="Os elencos aparecem assim que as súmulas forem importadas." />)

    expect(screen.getByRole('heading', { name: 'Nenhum elenco em 2025 ainda' })).toBeInTheDocument()
    expect(screen.getByText('Os elencos aparecem assim que as súmulas forem importadas.')).toBeInTheDocument()
  })
})
