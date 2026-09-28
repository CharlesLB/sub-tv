import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { cruzeiroBadgeFixture } from '../accumulated-table/accumulated-table.fixtures'
import { CompetitionPresenceList } from './competition-presence-list'
import { competitionPresencesFixture } from './competition-presence-list.fixtures'

const meta = {
  title: 'History/CompetitionPresenceList',
  component: CompetitionPresenceList,
  args: { presences: competitionPresencesFixture, color: cruzeiroBadgeFixture.color },
} satisfies Meta<typeof CompetitionPresenceList>

export default meta

type Story = StoryObj<typeof meta>

export const WithPresences: Story = {}

export const Empty: Story = { args: { presences: [] } }
