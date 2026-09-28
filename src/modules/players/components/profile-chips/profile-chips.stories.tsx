import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CATEGORY } from '@/modules/championships/client'
import { ProfileChips } from './profile-chips'

const meta = {
  title: 'Players/ProfileChips',
  component: ProfileChips,
  args: { position: 'volante', preferredFoot: 'destro', teamName: 'Estrela do Vale', category: CATEGORY.SUB13 },
} satisfies Meta<typeof ProfileChips>

export default meta

type Story = StoryObj<typeof meta>

export const Complete: Story = {}

export const TeamOnly: Story = { args: { position: null, preferredFoot: null } }
