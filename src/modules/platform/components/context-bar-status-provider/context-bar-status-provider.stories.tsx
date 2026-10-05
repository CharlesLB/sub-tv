import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { ContextBarStatus } from '../context-bar-status/context-bar-status'
import { ContextBarStatusProvider } from './context-bar-status-provider'

const meta = {
  title: 'Platform/ContextBarStatusProvider',
  component: ContextBarStatusProvider,
  args: {
    status: <span>Operador E2E</span>,
    children: (
      <p>
        Barra de contexto: <ContextBarStatus />
      </p>
    ),
  },
} satisfies Meta<typeof ContextBarStatusProvider>

export default meta

type Story = StoryObj<typeof meta>

export const WithStatus: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Operador E2E')).toBeInTheDocument()
  },
}
