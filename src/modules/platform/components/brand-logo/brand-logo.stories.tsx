import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { BrandLogo } from './brand-logo'

const meta = {
  title: 'Platform/BrandLogo',
  component: BrandLogo,
} satisfies Meta<typeof BrandLogo>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
