import type { DataTableColumn } from './data-table'

export const dataTableColumnsFixture: readonly DataTableColumn[] = [
  { id: 'name', label: 'Nome', className: 'min-w-0 flex-1' },
  { id: 'team', label: 'Time', className: 'w-[140px] flex-none' },
]

export const dataTableRowsFixture = [
  { id: 'row-caio', name: 'Caio Mendes', team: 'Estrela do Vale' },
  { id: 'row-davi', name: 'Davi Rocha', team: 'Serra Azul' },
] as const
