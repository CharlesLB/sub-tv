import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { emptyAuditFilterFixture, selectedAuditFilterFixture } from '../audit-filters/audit-filters.fixtures'
import { AuditPagination } from './audit-pagination'

describe('AuditPagination', () => {
  it('renders nothing when there is a single page', () => {
    const { container } = render(<AuditPagination filter={emptyAuditFilterFixture} hasNextPage={false} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('disables the previous link and links to the next page on the first page', () => {
    render(<AuditPagination filter={emptyAuditFilterFixture} hasNextPage />)

    const previousLink = screen.getByRole('link', { name: 'Anteriores' })

    expect(screen.getByText('Página 1')).toBeInTheDocument()
    expect(previousLink).toHaveAttribute('aria-disabled', 'true')
    expect(previousLink).toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('link', { name: 'Mais antigas' })).toHaveAttribute('href', '/registro?pagina=2')
  })

  it('disables the next link and keeps the filters in the previous link on the last page', () => {
    render(<AuditPagination filter={{ ...selectedAuditFilterFixture, page: 3 }} hasNextPage={false} />)

    const nextLink = screen.getByRole('link', { name: 'Mais antigas' })

    expect(nextLink).toHaveAttribute('aria-disabled', 'true')
    expect(nextLink).toHaveAttribute('tabindex', '-1')

    expect(screen.getByRole('link', { name: 'Anteriores' })).toHaveAttribute(
      'href',
      `/registro?usuario=${selectedAuditFilterFixture.userId}&acao=ficha_do_jogador_alterada&entidade=jogador&periodo=7d&pagina=2`,
    )
  })
})
