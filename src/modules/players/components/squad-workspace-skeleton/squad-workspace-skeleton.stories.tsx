import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SquadWorkspaceSkeleton } from './squad-workspace-skeleton'

const meta = {
  title: 'Players/SquadWorkspaceSkeleton',
  component: SquadWorkspaceSkeleton,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', gap: 1, height: 640 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SquadWorkspaceSkeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
