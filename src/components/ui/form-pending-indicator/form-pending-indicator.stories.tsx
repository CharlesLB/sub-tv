import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'
import { NAVIGATION_PROGRESS_LABEL } from '../navigation-progress/navigation-progress'
import { FormPendingIndicator } from './form-pending-indicator'

const neverSettles = () => new Promise<void>(() => undefined)

const meta = {
  title: 'UI/FormPendingIndicator',
  component: FormPendingIndicator,
  decorators: [
    (Story) => (
      <form action={neverSettles}>
        <button type="submit">Filtrar</button>
        <Story />
      </form>
    ),
  ],
} satisfies Meta<typeof FormPendingIndicator>

export default meta

type Story = StoryObj<typeof meta>

export const Idle: Story = {}

export const Submitting: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Filtrar' }))

    await expect(await within(canvasElement.ownerDocument.body).findByRole('progressbar', { name: NAVIGATION_PROGRESS_LABEL })).toBeInTheDocument()
  },
}
