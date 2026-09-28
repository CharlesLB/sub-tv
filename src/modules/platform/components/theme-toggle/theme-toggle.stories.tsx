import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ThemeToggle } from './theme-toggle'

const meta = {
  title: 'Platform/ThemeToggle',
  component: ThemeToggle,
} satisfies Meta<typeof ThemeToggle>

export default meta

type Story = StoryObj<typeof meta>

export const LightTheme: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(await canvas.findByRole('button', { name: 'Mudar para o modo escuro' }))
    await expect(await canvas.findByRole('button', { name: 'Mudar para o modo claro' })).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Mudar para o modo claro' }))
    await expect(await canvas.findByRole('button', { name: 'Mudar para o modo escuro' })).toBeInTheDocument()
  },
}

export const DarkTheme: Story = {
  globals: { theme: 'escuro' },
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByRole('button', { name: 'Mudar para o modo claro' })).toBeInTheDocument()
  },
}
