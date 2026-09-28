import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { MatchInfoStep } from './match-info-step'

const meta = {
  title: 'Matches/MatchInfoStep',
  component: MatchInfoStep,
  args: {
    values: { date: '2026-10-03', time: '10:00', round: '7', venue: '' },
    notice: 'Esta partida pertence a Mineiro SUB-14. A categoria não é escolhida aqui: ela vem do campeonato e define quais times e atletas aparecem nas próximas etapas.',
    onChange: fn(),
  },
} satisfies Meta<typeof MatchInfoStep>

export default meta

type Story = StoryObj<typeof meta>

export const WithNotice: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.type(within(canvasElement).getByLabelText('Local'), 'A')
    await expect(args.onChange).toHaveBeenCalledWith('venue', 'A')
  },
}

export const Filled: Story = { args: { values: { date: '2026-10-03', time: '09:30', round: '8', venue: 'Arena do Vale · campo 2' }, notice: null } }
