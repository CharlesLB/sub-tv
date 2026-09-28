import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Crest } from './crest'
import { CREST_COLOR, CREST_IMAGE_PATH } from './crest.fixtures'

const meta = {
  title: 'UI/Crest',
  component: Crest,
  args: { color: CREST_COLOR },
} satisfies Meta<typeof Crest>

export default meta

type Story = StoryObj<typeof meta>

export const Hexagon: Story = {}

export const LargeHexagon: Story = { args: { width: 48 } }

export const WithImage: Story = { args: { imagePath: CREST_IMAGE_PATH, width: 48 } }
