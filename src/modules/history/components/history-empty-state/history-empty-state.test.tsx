import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HistoryEmptyState } from './history-empty-state'

describe('HistoryEmptyState', () => {
  it('shows the given message', () => {
    render(<HistoryEmptyState message="Nenhum gol registrado para os filtros selecionados" />)

    expect(screen.getByText('Nenhum gol registrado para os filtros selecionados')).toBeInTheDocument()
  })
})
