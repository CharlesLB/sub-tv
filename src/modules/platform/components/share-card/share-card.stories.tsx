import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ShareCard } from './share-card'
import { shareCardFixture } from './share-card.fixtures'

const SHARE_IMAGE_WIDTH = 1200
const SHARE_IMAGE_HEIGHT = 630

const meta = {
  title: 'Platform/ShareCard',
  component: ShareCard,
  args: shareCardFixture,
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', width: SHARE_IMAGE_WIDTH, height: SHARE_IMAGE_HEIGHT }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ShareCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
