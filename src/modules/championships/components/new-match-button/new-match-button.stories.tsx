import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SEASON_ID_FIXTURE } from '../match-card/match-card.fixtures'
import { NewMatchButton } from './new-match-button'

const meta = {
  title: 'Championships/NewMatchButton',
  component: NewMatchButton,
  args: { seasonId: SEASON_ID_FIXTURE },
} satisfies Meta<typeof NewMatchButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
