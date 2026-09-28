import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { awayTeamFixture, homeTeamFixture } from '../lineup-card/lineup-card.fixtures'
import { BenchColumn } from './bench-column'

const meta = {
  title: 'Matches/BenchColumn',
  component: BenchColumn,
  args: {
    team: homeTeamFixture,
    categoryLabel: 'SUB-14',
    starterCount: 11,
    reserves: homeTeamFixture.players.slice(11),
    draggingPlayerId: null,
    placement: 'left',
    onPointerDown: fn(),
    onKeyboardAdd: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'grid', gridTemplateColumns: '124px 1fr 124px', height: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BenchColumn>

export default meta

type Story = StoryObj<typeof meta>

export const FullLineup: Story = {
  play: async ({ args, canvasElement }) => {
    within(canvasElement).getByRole('button', { name: 'Reserva camisa 12, Otávio Siqueira' }).focus()
    await userEvent.keyboard('{Enter}')
    await expect(args.onKeyboardAdd).toHaveBeenCalled()
  },
}

export const IncompleteLineup: Story = { args: { team: awayTeamFixture, starterCount: 9, reserves: awayTeamFixture.players.slice(9), placement: 'right' } }

export const DraggingReserve: Story = { args: { draggingPlayerId: 'estrela-12' } }
