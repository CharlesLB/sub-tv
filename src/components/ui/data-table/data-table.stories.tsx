import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { DataTable } from './data-table'
import { dataTableColumnsFixture, dataTableRowsFixture } from './data-table.fixtures'
import { DataTableSkeleton } from './data-table.skeleton'

const ROW_CLASS = 'flex items-center gap-3 px-3 py-[10px] text-[12px] text-tx'
const TEXT_BAR_CLASS = 'inline-block h-[0.8em] w-[96px] align-middle'
const LOADING_ROW_COUNT = 2

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

export const Loading: Story = {
  render: () => (
    <DataTableSkeleton
      label="Atletas"
      columns={dataTableColumnsFixture}
      rowCount={LOADING_ROW_COUNT}
      rowClassName={ROW_CLASS}
      stripeClassNames={{ even: 'bg-pan', odd: 'bg-pan0' }}
      renderCells={(order) => (
        <>
          <td className="min-w-0 flex-1">
            <Skeleton className={TEXT_BAR_CLASS} delayMs={order * 60} />
          </td>
          <td className="w-[140px] flex-none">
            <Skeleton className={TEXT_BAR_CLASS} delayMs={order * 60} />
          </td>
        </>
      )}
    />
  ),
}
