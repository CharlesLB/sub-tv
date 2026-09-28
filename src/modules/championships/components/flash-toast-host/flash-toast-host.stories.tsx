import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { clearFlashMessage, showFlashMessage } from '../../flash-message/flash-message'
import { FlashToastHost } from './flash-toast-host'

const meta = {
  title: 'Championships/FlashToastHost',
  component: FlashToastHost,
  beforeEach: () => {
    clearFlashMessage()

    return clearFlashMessage
  },
} satisfies Meta<typeof FlashToastHost>

export default meta

type Story = StoryObj<typeof meta>

export const WithoutMessage: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('status')).not.toBeInTheDocument()
  },
}

export const WithMessage: Story = {
  beforeEach: () => {
    showFlashMessage('Campeonato criado · SUB-14')
  },
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByRole('status')).toHaveTextContent('Campeonato criado')
  },
}
