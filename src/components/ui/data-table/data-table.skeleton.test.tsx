import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { dataTableColumnsFixture } from './data-table.fixtures'
import { DataTableSkeleton } from './data-table.skeleton'

const ROW_COUNT = 3
const STRIPES = { even: 'bg-pan', odd: 'bg-pan0' }

const renderSkeleton = () =>
  render(
    <DataTableSkeleton label="Atletas" columns={dataTableColumnsFixture} rowCount={ROW_COUNT} rowClassName="flex" stripeClassNames={STRIPES} renderCells={(order) => <td>{`linha ${order}`}</td>} />,
  )

describe('DataTableSkeleton', () => {
  it('hides the placeholder table from assistive technology', () => {
    const { container } = renderSkeleton()

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('keeps the real column headers and draws the requested number of body rows', () => {
    renderSkeleton()

    expect(screen.getAllByRole('columnheader', { hidden: true }).map((header) => header.textContent)).toEqual(['Nome', 'Time'])
    expect(screen.getAllByRole('row', { hidden: true })).toHaveLength(ROW_COUNT + 1)
  })

  it('alternates the stripe class between even and odd rows', () => {
    renderSkeleton()

    const bodyRows = screen.getAllByRole('row', { hidden: true }).slice(1)
    expect(bodyRows.map((row) => row.className)).toEqual(['flex bg-pan', 'flex bg-pan0', 'flex bg-pan'])
  })

  it('renders the cells the caller draws for each row order', () => {
    renderSkeleton()

    expect(screen.getByText('linha 2')).toBeInTheDocument()
  })
})
