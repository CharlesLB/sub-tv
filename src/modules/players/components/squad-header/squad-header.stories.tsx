import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { SquadHeader } from './squad-header'
import { teamSquadFixture } from './squad-header.fixtures'
import { SquadHeaderSkeleton } from './squad-header.skeleton'

const meta = {
  title: 'Players/SquadHeader',
  component: SquadHeader,
  args: { squad: teamSquadFixture, searchText: '', canEdit: false, onSearchChange: fn(), onPlayerCreated: fn() },
} satisfies Meta<typeof SquadHeader>

export default meta

type Story = StoryObj<typeof meta>

export const ReadOnly: Story = {}

export const Editable: Story = { args: { canEdit: true } }

export const Search: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.type(within(canvasElement).getByRole('searchbox', { name: 'Buscar atleta por nome ou número' }), '7')
    await expect(args.onSearchChange).toHaveBeenCalledWith('7')
  },
}

export const Loading: Story = { render: () => <SquadHeaderSkeleton /> }
