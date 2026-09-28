import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SquadsSkeleton } from './squads-skeleton'

const meta = {
  title: 'Players/SquadsSkeleton',
  component: SquadsSkeleton,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', flexDirection: 'column', height: 640 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SquadsSkeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
