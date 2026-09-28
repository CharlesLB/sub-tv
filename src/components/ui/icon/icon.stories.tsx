import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Icon } from './icon'

const meta = {
  title: 'UI/Icon',
  component: Icon,
  args: { name: 'trophy' },
} satisfies Meta<typeof Icon>

export default meta

type Story = StoryObj<typeof meta>

export const Decorative: Story = {}

export const Labeled: Story = { args: { name: 'error', label: 'Erro', size: 26 } }

export const Large: Story = { args: { name: 'sportsSoccer', size: 48 } }
