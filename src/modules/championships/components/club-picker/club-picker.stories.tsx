import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ClubPicker } from './club-picker'
import { clubOptionsFixture, serranoClubFixture, valeVerdeClubFixture } from './club-picker.fixtures'

const meta = {
  title: 'Championships/ClubPicker',
  component: ClubPicker,
  args: { clubs: clubOptionsFixture, selectedClubIds: [], onToggle: fn() },
} satisfies Meta<typeof ClubPicker>

export default meta

type Story = StoryObj<typeof meta>

export const NothingSelected: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('checkbox', { name: 'Vale Verde EC' }))
    await expect(args.onToggle).toHaveBeenCalledWith(valeVerdeClubFixture.clubId)
  },
}

export const WithSelection: Story = { args: { selectedClubIds: [serranoClubFixture.clubId] } }

export const WithoutClubs: Story = { args: { clubs: [] } }
