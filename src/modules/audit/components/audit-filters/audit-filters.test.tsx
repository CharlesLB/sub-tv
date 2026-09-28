import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuditFilters } from './audit-filters'
import { auditUserOptionsFixture, emptyAuditFilterFixture, selectedAuditFilterFixture } from './audit-filters.fixtures'

describe('AuditFilters', () => {
  it('starts every filter on its default option when nothing is selected', () => {
    render(<AuditFilters filter={emptyAuditFilterFixture} users={auditUserOptionsFixture} />)

    expect(screen.getByLabelText(/^Usuário/)).toHaveValue('')
    expect(screen.getByLabelText(/^Ação/)).toHaveValue('')
    expect(screen.getByLabelText(/^Período/)).toHaveValue('tudo')
    expect(screen.getByLabelText(/^Entidade/)).toHaveValue('')
  })

  it('preselects the filters from the current query', () => {
    render(<AuditFilters filter={selectedAuditFilterFixture} users={auditUserOptionsFixture} />)

    expect(screen.getByRole('option', { name: 'Otávio Prado' })).toHaveProperty('selected', true)
    expect(screen.getByRole('option', { name: 'Alterou a ficha do jogador' })).toHaveProperty('selected', true)
    expect(screen.getByRole('option', { name: 'Últimos 7 dias' })).toHaveProperty('selected', true)
    expect(screen.getByRole('option', { name: 'Jogador' })).toHaveProperty('selected', true)
  })

  it('lists every user as an option after the all users option', () => {
    render(<AuditFilters filter={emptyAuditFilterFixture} users={auditUserOptionsFixture} />)

    expect(screen.getByRole('option', { name: 'Todos' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Marina Couto' })).toHaveValue(auditUserOptionsFixture[0]?.id)
  })

  it('offers the filter button and a link that clears the filters', () => {
    render(<AuditFilters filter={selectedAuditFilterFixture} users={auditUserOptionsFixture} />)

    expect(screen.getByRole('button', { name: 'Filtrar' })).toHaveAttribute('type', 'submit')
    expect(screen.getByRole('link', { name: 'Limpar' })).toHaveAttribute('href', '/registro')
  })
})
