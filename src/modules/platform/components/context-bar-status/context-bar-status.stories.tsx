import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { ContextBarStatusProvider } from '../context-bar-status-provider/context-bar-status-provider'
import { ContextBarStatus } from './context-bar-status'

const meta = {
  title: 'Platform/ContextBarStatus',
  component: ContextBarStatus,
} satisfies Meta<typeof ContextBarStatus>

export default meta

type Story = StoryObj<typeof meta>

export const WithChips: Story = {
  decorators: [
    (Story) => (
      <ContextBarStatusProvider status={<button type="button">Sair</button>}>
        <Story />
      </ContextBarStatusProvider>
    ),
  ],
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Sair' })).toBeInTheDocument()
  },
}

export const OutsideThePlatform: Story = {}
