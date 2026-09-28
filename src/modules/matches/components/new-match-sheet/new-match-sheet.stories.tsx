import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { getRouter } from '@storybook/nextjs-vite/navigation.mock'
import { expect, screen, userEvent } from 'storybook/test'
import { CATEGORY, CategoryTag } from '@/modules/championships/client'
import { NewMatchSheet } from './new-match-sheet'

const meta = {
  title: 'Matches/NewMatchSheet',
  component: NewMatchSheet,
  args: { details: <CategoryTag category={CATEGORY.SUB14} size="medium" />, children: <p>Conteúdo do assistente de nova partida</p> },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof NewMatchSheet>

export default meta

type Story = StoryObj<typeof meta>

export const Open: Story = {
  play: async () => {
    await expect(await screen.findByRole('dialog', { name: 'Nova partida' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }))
    await expect(getRouter().back).toHaveBeenCalled()
  },
}
