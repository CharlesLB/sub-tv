import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SignInToEdit } from './sign-in-to-edit'

const meta = {
  title: 'Players/SignInToEdit',
  component: SignInToEdit,
  args: { returnTo: '/elencos?temporada=2025' },
} satisfies Meta<typeof SignInToEdit>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
