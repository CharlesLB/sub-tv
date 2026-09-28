import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DataTable } from './data-table'
import { dataTableColumnsFixture, dataTableRowsFixture } from './data-table.fixtures'

describe('DataTable', () => {
  it('renders a named table with one column header per column', () => {
    render(<DataTable label="Atletas" columns={dataTableColumnsFixture} />)

    expect(screen.getByRole('table', { name: 'Atletas' })).toBeInTheDocument()
    expect(screen.getAllByRole('columnheader').map((header) => header.textContent)).toEqual(['Nome', 'Time'])
  })

  it('renders the given rows inside the table body', () => {
    render(
      <DataTable label="Atletas" columns={dataTableColumnsFixture}>
        {dataTableRowsFixture.map((row) => (
          <tr key={row.id}>
            <td>{row.name}</td>
            <td>{row.team}</td>
          </tr>
        ))}
      </DataTable>,
    )

    expect(screen.getAllByRole('row')).toHaveLength(dataTableRowsFixture.length + 1)
    expect(screen.getByRole('cell', { name: 'Davi Rocha' })).toBeInTheDocument()
  })
})
