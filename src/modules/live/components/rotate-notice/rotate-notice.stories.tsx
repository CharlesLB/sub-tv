import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { RotateNotice } from './rotate-notice'

const meta = {
  title: 'Live/RotateNotice',
  component: RotateNotice,
} satisfies Meta<typeof RotateNotice>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
