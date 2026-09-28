import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { DataTable } from './data-table'
import { dataTableColumnsFixture, dataTableRowsFixture } from './data-table.fixtures'

const ROW_CLASS = 'flex items-center gap-3 px-3 py-[10px] text-[12px] text-tx'

const meta = {
  title: 'UI/DataTable',
  component: DataTable,
  args: { label: 'Atletas', columns: dataTableColumnsFixture },
} satisfies Meta<typeof DataTable>

export default meta

type Story = StoryObj<typeof meta>

export const WithRows: Story = {
  args: {
    children: dataTableRowsFixture.map((row) => (
      <tr key={row.id} className={ROW_CLASS}>
        <td className="min-w-0 flex-1">{row.name}</td>
        <td className="w-[140px] flex-none">{row.team}</td>
      </tr>
    )),
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('cell', { name: 'Davi Rocha' })).toBeInTheDocument()
  },
}

export const HeaderOnly: Story = {}
