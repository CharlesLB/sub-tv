import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { PitchDot } from './pitch-dot'

const meta = {
  title: 'Matches/PitchDot',
  component: PitchDot,
  args: {
    shirtNumber: 10,
    label: 'Teteu',
    description: 'Camisa 10 — Matheus Rocha, Estrela do Vale',
    color: '#1f4fa3',
    point: { x: 50, y: 50 },
    isDragging: false,
    isSwapTarget: false,
    onPointerDown: fn(),
    onKeyboardBench: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', width: 420, aspectRatio: '105 / 64', containerType: 'size', background: 'var(--gr0)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PitchDot>

export default meta

type Story = StoryObj<typeof meta>

export const Idle: Story = {
  play: async ({ args, canvasElement }) => {
    const dot = within(canvasElement).getByRole('button', { name: /Camisa 10/ })

    dot.focus()
    await userEvent.keyboard('{Enter}')
    await expect(args.onKeyboardBench).toHaveBeenCalled()
  },
}

export const Dragging: Story = { args: { isDragging: true, point: { x: 40, y: 30 } } }

export const SwapTarget: Story = { args: { isSwapTarget: true } }
