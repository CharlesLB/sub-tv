import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { getAuditEntries } from '../../data/get-audit-entries'
import { getAuditUserOptions } from '../../data/get-audit-user-options'
import { auditUserOptionsFixture, selectedAuditFilterFixture } from '../audit-filters/audit-filters.fixtures'
import { AuditLogScreen } from './audit-log-screen'
import { auditPageFixture, emptyAuditPageFixture } from './audit-log-screen.fixtures'

const renderScreen = async (query: Record<string, string | string[] | undefined>) => render(<Suspense>{await AuditLogScreen({ query })}</Suspense>)

describe('AuditLogScreen', () => {
  it('shows the filters, the changes and the pagination when there are more pages', async () => {
    vi.mocked(getAuditUserOptions).mockResolvedValue(auditUserOptionsFixture)
    vi.mocked(getAuditEntries).mockResolvedValue(auditPageFixture)

    await renderScreen({})

    expect(screen.getByRole('button', { name: 'Filtrar' })).toBeInTheDocument()
    expect(screen.getByRole('table', { name: 'Registro de alterações' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Paginação' })).toBeInTheDocument()
  })

  it('shows the empty message without pagination when nothing matches', async () => {
    vi.mocked(getAuditUserOptions).mockResolvedValue(auditUserOptionsFixture)
    vi.mocked(getAuditEntries).mockResolvedValue(emptyAuditPageFixture)

    await renderScreen({})

    expect(screen.getByText('Nenhuma alteração encontrada para os filtros selecionados')).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Paginação' })).not.toBeInTheDocument()
  })

  it('asks for the entries with the filter parsed from the query', async () => {
    vi.mocked(getAuditUserOptions).mockResolvedValue(auditUserOptionsFixture)
    vi.mocked(getAuditEntries).mockResolvedValue(auditPageFixture)

    await renderScreen({ usuario: selectedAuditFilterFixture.userId ?? undefined, acao: 'ficha_do_jogador_alterada', entidade: 'jogador', periodo: '7d', pagina: '1' })

    expect(getAuditEntries).toHaveBeenCalledWith(selectedAuditFilterFixture)
  })
})
