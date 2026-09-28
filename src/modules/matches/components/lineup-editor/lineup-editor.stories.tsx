import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, within } from 'storybook/test'
import { CATEGORY } from '@/modules/championships/client'
import { LINEUP_VIEW } from '../../wizard-reducer/wizard-reducer'
import { boardSidesFixture } from '../lineup-board/lineup-board.fixtures'
import { LineupEditor } from './lineup-editor'

const meta = {
  title: 'Matches/LineupEditor',
  component: LineupEditor,
  args: { sides: boardSidesFixture, view: LINEUP_VIEW.FIELD, category: CATEGORY.SUB14, year: 2026, dispatch: fn() },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', flexDirection: 'column', height: 640 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LineupEditor>

export default meta

type Story = StoryObj<typeof meta>

export const FieldView: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByText(/Estrela do Vale/).length).toBeGreaterThan(0)
  },
}

export const ListView: Story = {
  args: { view: LINEUP_VIEW.LIST },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('region', { name: 'Escalação Estrela do Vale' })).toBeInTheDocument()
  },
}
