import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { NAVIGATION_PROGRESS_LABEL, NavigationProgress } from './navigation-progress'

const meta = {
  title: 'UI/NavigationProgress',
  component: NavigationProgress,
  args: { isActive: true },
} satisfies Meta<typeof NavigationProgress>

export default meta

type Story = StoryObj<typeof meta>

export const Pending: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement.ownerDocument.body).getByRole('progressbar', { name: NAVIGATION_PROGRESS_LABEL })).toBeInTheDocument()
  },
}

export const Idle: Story = { args: { isActive: false } }
