import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { ScoreValue } from './score-value'

const PULSE_CLASS = 'animate-score-pulse'

const meta = {
  title: 'Live/ScoreValue',
  component: ScoreValue,
  args: { value: 0 },
} satisfies Meta<typeof ScoreValue>

export default meta

type Story = StoryObj<typeof meta>

export const Resting: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('0')).not.toHaveClass(PULSE_CLASS)
  },
}

const ScoringValue = () => {
  const [value, setValue] = useState(1)

  return (
    <>
      <ScoreValue value={value} />
      <button type="button" onClick={() => setValue(value + 1)}>
        Marcar gol
      </button>
    </>
  )
}

export const Pulsing: Story = {
  render: () => <ScoringValue />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Marcar gol' }))
    await expect(canvas.getByText('2')).toHaveClass(PULSE_CLASS)
  },
}
