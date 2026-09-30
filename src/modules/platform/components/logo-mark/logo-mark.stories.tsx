import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { LogoMark } from './logo-mark'

const meta = {
  title: 'Platform/LogoMark',
  component: LogoMark,
  args: { size: 32 },
} satisfies Meta<typeof LogoMark>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Large: Story = { args: { size: 150 } }
