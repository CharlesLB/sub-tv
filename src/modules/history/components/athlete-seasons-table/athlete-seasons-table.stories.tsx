import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { athleteHistoryFixture } from '../athlete-hero/athlete-hero.fixtures'
import { AthleteSeasonsTable } from './athlete-seasons-table'

const meta = {
  title: 'History/AthleteSeasonsTable',
  component: AthleteSeasonsTable,
  args: { seasons: athleteHistoryFixture.seasons },
} satisfies Meta<typeof AthleteSeasonsTable>

export default meta

type Story = StoryObj<typeof meta>

export const WithSeasons: Story = {}
