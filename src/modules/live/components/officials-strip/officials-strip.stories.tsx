import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { OfficialsStrip } from './officials-strip'
import { officialsStripItemsFixture } from './officials-strip.fixtures'
import { OfficialsStripSkeleton } from './officials-strip.skeleton'

const meta = {
  title: 'Live/OfficialsStrip',
  component: OfficialsStrip,
  args: { items: officialsStripItemsFixture },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof OfficialsStrip>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const OnlyMatchDuration: Story = { args: { items: officialsStripItemsFixture.filter((item) => item.key === 'tempo') } }

export const Loading: Story = { render: () => <OfficialsStripSkeleton /> }
