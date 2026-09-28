import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { PageFrame } from './page-frame'

const meta = {
  title: 'Audit/PageFrame',
  component: PageFrame,
  args: { children: <h1>Registro de alterações</h1> },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof PageFrame>

export default meta

type Story = StoryObj<typeof meta>

export const WithContent: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('heading', { name: 'Registro de alterações' })).toBeInTheDocument()
  },
}
