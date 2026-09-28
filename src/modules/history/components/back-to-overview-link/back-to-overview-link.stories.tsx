import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { loadedHistoryFilterFixture } from '../athlete-history-screen/athlete-history-screen.fixtures'
import { BackToOverviewLink } from './back-to-overview-link'

const meta = {
  title: 'History/BackToOverviewLink',
  component: BackToOverviewLink,
  args: { filter: loadedHistoryFilterFixture.filter },
} satisfies Meta<typeof BackToOverviewLink>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
