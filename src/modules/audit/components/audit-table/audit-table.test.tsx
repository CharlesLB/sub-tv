import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuditTable } from './audit-table'
import { auditRowsFixture, playerProfileChangeRowFixture } from './audit-table.fixtures'

describe('AuditTable', () => {
  it('shows the empty message when no change matches the filters', () => {
    render(<AuditTable rows={[]} />)

    expect(screen.getByText('Nenhuma alteração encontrada para os filtros selecionados')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('shows the column headers and one row per change', () => {
    render(<AuditTable rows={auditRowsFixture} />)

    expect(screen.getByRole('table', { name: 'Registro de alterações' })).toBeInTheDocument()
    expect(screen.getAllByRole('columnheader').map((header) => header.textContent)).toEqual(['Quando', 'Quem', 'O quê', 'Onde', 'Detalhes'])
    expect(screen.getAllByRole('row')).toHaveLength(auditRowsFixture.length + 1)
  })

  it('shows when, who, what, where and the details of a change', () => {
    render(<AuditTable rows={[playerProfileChangeRowFixture]} />)

    const row = within(screen.getAllByRole('row')[1] ?? document.body)

    expect(row.getByText('20/09/2026 10:05')).toBeInTheDocument()
    expect(row.getByText('Marina Couto')).toBeInTheDocument()
    expect(row.getByText('Alterou a ficha do jogador')).toBeInTheDocument()
    expect(row.getByText('Jogador')).toBeInTheDocument()
    expect(row.getByText('Caio Mendes (Caiozinho)')).toBeInTheDocument()
    expect(row.getByTitle('Apelido, posição')).toHaveTextContent('Apelido, posição')
  })

  it('shows a dash and no entity label when the change has no entity', () => {
    render(<AuditTable rows={auditRowsFixture} />)

    const row = within(screen.getAllByRole('row')[2] ?? document.body)

    expect(row.getByText('—')).toBeInTheDocument()
    expect(row.queryByText('Jogador')).not.toBeInTheDocument()
  })
})
